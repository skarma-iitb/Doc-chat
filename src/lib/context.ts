import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";
import { db } from "./db";
import { chats } from "./db/schema";
import { eq } from "drizzle-orm";

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  try {
    const client = new Pinecone({
      environment: process.env.PINECONE_ENVIRONMENT!,
      apiKey: process.env.PINECONE_API_KEY!,
    });
    const pineconeIndex = await client.index("doc-chat");
    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
    const queryResult = await namespace.query({
      topK: 5,
      vector: embeddings,
      includeMetadata: true,
    });
    return queryResult.matches || [];
  } catch (error) {
    console.log("error querying embeddings", error);
    throw error;
  }
}

export async function getContext(docKey: string) {
  // const queryEmbeddings = await getEmbeddings(query);
  // const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);
  // const qualifyingDocs = matches.filter(
  //   (match) => match.score && match.score > 0.2
  // );
  // type Metadata = {
  //   text: string;
  //   pageNumber: number;
  // };
  // let docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text);
  // // 5 vectors
  // return docs.join("\n").substring(0, 3000);
  let chat;
  chat = await db.select().from(chats).where(eq(chats.docKey, docKey));

  return chat[0]?.context ?? "";
}
