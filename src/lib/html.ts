import puppeteer from "puppeteer";
import TurndownService from "turndown";
import { convert } from "html-to-text";

export async function getHTMLFromUrl(pageUrl: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setJavaScriptEnabled(true);

  await page.goto(pageUrl, { waitUntil: "networkidle2" });

  await new Promise((r) => setTimeout(r, 3000));

  const html = await page.content();
  console.log({ scrapedHtml: html });
  await browser.close();

  return html;
}

export const getPageContentFromUrl = async (url: string) => {
  const html = await getHTMLFromUrl(url);

  // const turndownService = new TurndownService();
  const plainText = convert(html, {
    wordwrap: 130,
  });
  console.log({ pageContent: plainText });

  return plainText;
};
