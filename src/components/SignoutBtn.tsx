"use client";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function SignoutBtn() {
  const session = useSession();

  if (session.data?.user)
    return (
      <button
        className="px-4 py-2 rounded flex items-center text-sm gap-2 border border-black"
        onClick={() => signOut()}
      >
        <span className="font-medium"> Sign out</span>
        <LogOut className="w-4 h-4" />
      </button>
    );
  else return <></>;
}
