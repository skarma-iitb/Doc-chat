"use client";

import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { generateNameFromUrl } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { Button } from "./ui/button";

export default function DocUrlInputForm() {
  const [inputUrl, setInputUrl] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await axios.post("/api/create-chat", {
          url: inputUrl,
          name: generateNameFromUrl(inputUrl),
          key: uuidv4(),
        });

        setLoading(false);

        if (res?.data) router.push("/chat/" + res?.data?.chat_id);
      }}
      className="flex w-full items-center gap-2"
    >
      <input
        type="text"
        onChange={(e) => setInputUrl(e.target.value)}
        value={inputUrl}
        placeholder="Enter a Documentation's URL"
        className="w-full px-4 py-2 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
      />
      <Button
        type="submit"
        disabled={inputUrl.length <= 3}
        className="text-xl min-w-fit flex items-center gap-2"
      >
        {loading ? <Loader /> : <>{"💬 "}</>}
        Let&apos;s chat
      </Button>
    </form>
  );
}
