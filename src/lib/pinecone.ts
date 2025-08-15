import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import md5 from "md5";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embeddings";
import { convertToAscii } from "./utils";
import { getHTMLFromUrl } from "./html";
import cheerio from "cheerio";

export const getPineconeClient = () => {
  return new Pinecone({
    environment: process.env.PINECONE_ENVIRONMENT!,
    apiKey: process.env.PINECONE_API_KEY!,
  });
};

type Page = {
  pageContent: string;
};

export async function loadHTMLIntoPinecone(url: string) {
  // 1. obtain page html -> convert to pdf
  const html = await getHTMLFromUrl(url);

  console.log({ html });

  // 2. paragraphs from html

  const $ = cheerio.load(html);

  // Select all paragraph elements and extract their text content
  // const paragraphs: string[] = [];
  // $("p").each((index, element) => {
  //   const paragraphText = $(element).text();
  //   paragraphs.push(paragraphText);
  // });

  // console.log({ paragraphs });

  const page = { pageContent: $("body").text() };

  //TODO handle internal pages too
  const documents = await Promise.all([page].map(prepareDocument));

  // 3. vectorise and embed individual documents
  const vectors = (
    await Promise.all(documents.flat().map(embedDocument))
  )?.filter((pr) => !!pr) as PineconeRecord[];

  // 4. upload to pinecone
  const client = await getPineconeClient();
  const pineconeIndex = await client.index("doc-chat");
  const namespace = pineconeIndex.namespace(convertToAscii(url));

  await namespace.upsert(vectors);

  return documents[0];
}

async function embedDocument(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    if (embeddings.length === 0) return;
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as PineconeRecord;
  } catch (error) {
    console.log("error embedding document", error);
    throw error;
  }
}

export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

async function prepareDocument(page: Page) {
  let { pageContent } = page;
  pageContent = pageContent.replace(/\n/g, "");

  console.log({ pageContent });

  // split the docs
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);
  return docs;
}
