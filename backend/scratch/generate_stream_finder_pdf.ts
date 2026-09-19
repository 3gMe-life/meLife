import puppeteer from "puppeteer-core";
import path from "path";
import fs from "fs";
import { pool, connectDatabase, closeDatabasePool } from "../src/config/database";
import { sessionRepository } from "../src/modules/sessions/session.repository";
import { authTokenService } from "../src/modules/auth/auth.token.service";
import { env } from "../src/config/env";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const ARTIFACTS_DIR = "/Users/harshadmt/.gemini/antigravity-ide/brain/f5627755-4edf-479d-8c1f-8f351c0269f6";

async function generatePdfAndScreenshots() {
  await connectDatabase();

  // 1. Find a completed attempt for STREAM_FINDER
  const attemptRes = await pool.query(
    `SELECT a.id, a.participant_id, u.email
     FROM assessment_attempts a
     JOIN users u ON a.participant_id = u.id
     JOIN assessments ass ON a.assessment_id = ass.id
     WHERE ass.code = 'STREAM_FINDER' AND a.status = 'COMPLETED'
     ORDER BY a.completed_at DESC LIMIT 1`
  );

  if (!attemptRes.rows[0]) {
    console.error("No completed STREAM_FINDER attempt found in DB");
    await closeDatabasePool();
    return;
  }

  const attempt = attemptRes.rows[0];
  console.log(`Found completed attempt: ${attempt.id} for participant: ${attempt.email} (ID: ${attempt.participant_id})`);

  // 2. Create an active session and sign access token
  const rawRefreshToken = authTokenService.generateOpaqueRefreshToken();
  const refreshTokenHash = authTokenService.hashRefreshToken(rawRefreshToken);
  const session = await sessionRepository.createSession({
    userId: attempt.participant_id,
    refreshTokenHash,
    userAgent: "Puppeteer / Chrome Test Suite",
    ipAddress: "127.0.0.1",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const accessToken = authTokenService.signAccessToken({
    userId: attempt.participant_id,
    sessionId: session.id,
    role: "PARTICIPANT",
    permissions: [],
  });

  console.log("Created valid test session and access token.");

  // 3. Launch Puppeteer with Chrome
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--window-size=1280,1800",
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });

  // 4. Set auth cookies
  await page.setCookie(
    {
      name: env.REFRESH_COOKIE_NAME,
      value: rawRefreshToken,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
    },
    {
      name: "access_token",
      value: accessToken,
      domain: "localhost",
      path: "/",
      httpOnly: false,
      sameSite: "Lax",
    }
  );

  // Set auth state in frontend
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ({ tok, user, sessionData }) => {
      localStorage.setItem("token", tok);
      localStorage.setItem("access_token", tok);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("session", JSON.stringify(sessionData));
    },
    {
      tok: accessToken,
      user: { id: attempt.participant_id, email: attempt.email, role: "PARTICIPANT" },
      sessionData: { id: session.id },
    }
  );

  // 5. Navigate to the Stream Finder result page
  const reportUrl = `http://localhost:3000/participant/results/${attempt.id}`;
  console.log(`Navigating to ${reportUrl}...`);
  await page.goto(reportUrl, { waitUntil: "networkidle0", timeout: 35000 });

  // 6. Wait for report containers to render
  console.log("Waiting for .report-page-container elements...");
  await page.waitForSelector(".report-page-container", { timeout: 20000 });
  await new Promise((r) => setTimeout(r, 2500));

  // 7. Check page elements count
  const pageContainers = await page.$$(".report-page-container");
  console.log(`✨ Successfully detected ${pageContainers.length} report page containers.`);

  // 8. Capture individual page screenshots for visual validation
  const screenshotsDir = path.join(ARTIFACTS_DIR, "report_pages");
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  for (let i = 0; i < pageContainers.length; i++) {
    const screenshotPath = path.join(screenshotsDir, `page_${i + 1}.png`);
    await pageContainers[i].screenshot({ path: screenshotPath });
    const pBox = await pageContainers[i].boundingBox();
    console.log(`📸 Page ${i + 1}: Captured screenshot (${Math.round(pBox?.width || 0)}x${Math.round(pBox?.height || 0)}px) -> ${screenshotPath}`);
  }

  // 9. Generate A4 PDF with print media emulation
  await page.emulateMediaType("print");
  const pdfPath = path.join(ARTIFACTS_DIR, "stream_finder_report_verified.pdf");
  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
    margin: {
      top: "8mm",
      bottom: "8mm",
      left: "10mm",
      right: "10mm",
    },
    preferCSSPageSize: true,
  });

  const pdfStats = fs.statSync(pdfPath);
  console.log(`\n🎉 PDF GENERATION SUCCESSFUL!`);
  console.log(`📄 PDF Path: ${pdfPath}`);
  console.log(`📦 PDF File Size: ${(pdfStats.size / 1024).toFixed(1)} KB`);

  await browser.close();
  await closeDatabasePool();
}

generatePdfAndScreenshots().catch((err) => {
  console.error("PDF generation script failed:", err);
  process.exit(1);
});
