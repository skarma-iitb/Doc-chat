"use client";

import { LogIn } from "lucide-react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

export default function LoginBtn() {
  return (
    <Button onClick={() => signIn("github", { callbackUrl: "/" })}>
      Login to get Started!
      <LogIn className="w-4 h-4 ml-2" />
    </Button>
  );
}
