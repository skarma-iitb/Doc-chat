import puppeteer from "puppeteer";

export async function convertHtmlToPdf(pageUrl: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(pageUrl, { waitUntil: "networkidle2" });

  // Get the HTML content of the page

  // Generate PDF as a buffer
  const pdfBuffer = await page.pdf();

  // Close the browser
  await browser.close();

  const blobData = new Blob([pdfBuffer]);

  return blobData;
}
