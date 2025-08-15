import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, LogIn, UserIcon } from "lucide-react";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LoginBtn from "@/components/LoginBtn";
import SignoutBtn from "@/components/SignoutBtn";
import DocUrlInputForm from "@/components/DocUrlInputForm";
import Logo from "../../public/logo.png";
import Image from "next/image";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const isAuth = !!session?.user;

  let firstChat;
  if (session?.user) {
    firstChat = await db
      .select()
      .from(chats)
      .where(eq(chats.userId, session?.user?.id));
    if (firstChat) {
      firstChat = firstChat[0];
    }
  }
  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <div className="flex flex-col items-center">
              <Image src={Logo} height={100} width={100} alt="" />
              <h1 className="text-5xl font-semibold">
                h<span className="text-purple-600">AI</span>ve
              </h1>
              <h1 className="mt-2 text-xl">
                {"💬"}Chat with any {"📄"}Documentation
              </h1>
            </div>
          </div>

          <div className="flex mt-2"></div>

          <p className="max-w-xl mt-1 text-lg text-slate-600">
            Haive AI redefines collaboration by seamlessly integrating
            conversations with documentations. Experience a dynamic platform
            where your text comes to life through interactive discussions.
            Effortlessly connect and collaborate, turning static documentations
            into engaging dialogues. Welcome to a new era of documentation
            collaboration with Haive.
          </p>

          <div className="w-full mt-4">
            {isAuth ? <DocUrlInputForm /> : <LoginBtn />}
          </div>
        </div>
      </div>
      <div className="flex items-center right-2 top-2 fixed">
        {isAuth && firstChat && (
          <>
            <Link href={`/chat/${firstChat.id}`}>
              <Button>
                Go to Chats <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <div className="ml-3"></div>
          </>
        )}

        <SignoutBtn />
      </div>
    </div>
  );
}
