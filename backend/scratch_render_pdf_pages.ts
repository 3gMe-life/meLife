import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const ARTIFACT_DIR = "/Users/harshadmt/.gemini/antigravity-ide/brain/f5627755-4edf-479d-8c1f-8f351c0269f6";
const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

async function renderSkillFinderReport() {
  console.log("🚀 Launching headless Chrome...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });

  // 1. First test web result view
  console.log("📄 Navigating to local Skill Finder result page...");
  // Let's create an attempt or login to view result, or render PDF directly
  
  // Also render the generated PDF
  const pdfPath = path.resolve("./scratch_test_skill_finder_report.pdf");
  console.log("Rendering generated PDF at:", pdfPath);
  
  // We can render the PDF using PDF.js or Chrome's internal viewer
  await page.goto(`file://${pdfPath}`, { waitUntil: "networkidle0" });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "pdf_preview.png"), fullPage: true });

  console.log("Saved PDF preview image.");
  await browser.close();
}

renderSkillFinderReport().catch((err) => {
  console.error("Render failed:", err);
});
