import ChatComponent from "@/components/ChatComponent";
import ChatSideBar from "@/components/ChatSideBar";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
  const session = await getServerSession(authOptions);

  const _chats = await db
    .select()
    .from(chats)
    .where(eq(chats.userId, session?.user?.id ?? ""));
  if (!_chats) {
    return redirect("/");
  }
  if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
    return redirect("/");
  }

  const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));

  // const renderWebsite = async (url: string) => {
  //   const browser = await puppeteer.launch();
  //   const page = await browser.newPage();
  //   await page.goto(url);

  //   // Get the content of the page
  //   const content = await page.content();

  //   await browser.close();

  //   // Update the div content with the website content
  //   return content;
  //   // Close the browser
  // };

  // const htmlToRender = await renderWebsite(currentChat?.docUrl ?? "");

  if (!session?.user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex max-h-screen h-screen overflow-hidden">
      <div className="flex w-full h-screen max-h-screen overflow-hidden">
        {/* chat sidebar */}
        <div className="w-1/5 max-w-xs">
          <ChatSideBar chats={_chats} chatId={parseInt(chatId)} />
        </div>
        {/* web viewer */}
        {/* <div
          className="h-screen max-h-screen overflow-y-auto p-4 w-1/2"
          dangerouslySetInnerHTML={{ __html: htmlToRender }}
        /> */}
        <iframe className="w-1/2 h-screen" src={currentChat?.docUrl ?? ""} />
        {/* chat component */}
        <div className="w-[30%] border-l-4 h-screen border-l-slate-200">
          <ChatComponent chatId={parseInt(chatId)} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
