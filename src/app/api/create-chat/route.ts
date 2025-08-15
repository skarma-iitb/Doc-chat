import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { getHTMLFromUrl, getPageContentFromUrl } from "@/lib/html";
import { loadHTMLIntoPinecone } from "@/lib/pinecone";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// /api/create-chat
export async function POST(req: Request, res: Response) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { url, name, key } = body;

    const content = await getPageContentFromUrl(url);

    const chat_id = await db
      .insert(chats)
      .values({
        docKey: key,
        docName: name,
        docUrl: url,
        userId: session?.user?.id,
        context: content,
      })
      .returning({
        insertedId: chats.id,
      });

    return NextResponse.json(
      {
        chat_id: chat_id[0].insertedId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
