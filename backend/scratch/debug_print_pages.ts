import puppeteer from "puppeteer-core";
import jwt from "jsonwebtoken";
import { pool, connectDatabase, closeDatabasePool } from "../src/config/database";
import { sessionRepository } from "../src/modules/sessions/session.repository";
import { authTokenService } from "../src/modules/auth/auth.token.service";
import { env } from "../src/config/env";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

async function debugPrintPages() {
  await connectDatabase();

  const attemptRes = await pool.query(
    `SELECT a.id, a.participant_id, u.email
     FROM assessment_attempts a
     JOIN users u ON a.participant_id = u.id
     JOIN assessments ass ON a.assessment_id = ass.id
     WHERE ass.code = 'STREAM_FINDER' AND a.status = 'COMPLETED'
     ORDER BY a.completed_at DESC LIMIT 1`
  );

  const attempt = attemptRes.rows[0];

  const rawRefreshToken = authTokenService.generateOpaqueRefreshToken();
  const refreshTokenHash = authTokenService.hashRefreshToken(rawRefreshToken);
  const session = await sessionRepository.createSession({
    userId: attempt.participant_id,
    refreshTokenHash,
    userAgent: "Puppeteer Debug",
    ipAddress: "127.0.0.1",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const accessToken = authTokenService.signAccessToken({
    userId: attempt.participant_id,
    sessionId: session.id,
    role: "PARTICIPANT",
    permissions: [],
  });

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });

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

  await page.goto(`http://localhost:3000/participant/results/${attempt.id}`, { waitUntil: "networkidle0" });
  await page.waitForSelector(".report-page-container");

  // Emulate print media
  await page.emulateMediaType("print");

  // Check heights of each .report-page-container and whether something outside containers is printed
  const pageMetrics = await page.evaluate(() => {
    const containers = Array.from(document.querySelectorAll(".report-page-container"));
    return containers.map((el, i) => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return {
        pageIndex: i + 1,
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
        offsetHeight: (el as HTMLElement).offsetHeight,
        computedHeight: style.height,
        computedMaxHeight: style.maxHeight,
        marginTop: style.marginTop,
        marginBottom: style.marginBottom,
      };
    });
  });

  console.table(pageMetrics);

  // Also check if toolbar or footer or other elements are visible in print
  const nonHiddenElements = await page.evaluate(() => {
    const mainChildren = Array.from(document.querySelector("main")?.children || []);
    return mainChildren.map((child, i) => {
      const style = window.getComputedStyle(child);
      return {
        tag: child.tagName,
        className: (child as HTMLElement).className,
        display: style.display,
        height: (child as HTMLElement).offsetHeight,
      };
    });
  });

  console.log("\nMain container direct children in print mode:");
  console.table(nonHiddenElements);

  await browser.close();
  await closeDatabasePool();
}

debugPrintPages().catch(console.error);
