import PDFDocument from "pdfkit";

async function testPdfFix() {
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 35, bottom: 25, left: 40, right: 40 },
    bufferPages: true,
  });

  const buffers: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => buffers.push(chunk));

  // Page 1
  doc.text("Page 1 content", 40, 100);

  // Page 2
  doc.addPage();
  doc.text("Page 2 content", 40, 100);

  // Page 3
  doc.addPage();
  doc.text("Page 3 content", 40, 100);

  console.log("Pages before footer loop:", doc.bufferedPageRange().count);

  // Footer loop with Y=805, lineBreak: false or safe bottom margin
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    doc.text("Footer text", 40, 800, { width: 420, lineBreak: false });
    doc.text(`Page ${i + 1} of ${range.count}`, 465, 800, { width: 90, align: "right", lineBreak: false });
  }

  console.log("Pages after footer loop:", doc.bufferedPageRange().count);

  doc.end();
}

testPdfFix();
