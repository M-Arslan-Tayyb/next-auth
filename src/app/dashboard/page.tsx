"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import ChatForm from "@/components/ChatForm";
import ChatMessage from "@/components/ChatMessage";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [roomId, setRoomId] = useState<string | null>(null);

  const username = session?.user?.name || "Guest";

  console.log("Session data:", session);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/login");
  }
  if (!session) {
    return <div>No session found.</div>;
  }

  return (
    <main className="min-h-screen px-4 py-8 bg-background flex flex-col items-center">
      <h2 className="text-2xl font-bold text-purple-600 mb-2">
        Welcome, {username}
      </h2>

      {!roomId ? (
        <ChatForm onRoomJoin={setRoomId} />
      ) : (
        <ChatMessage roomId={roomId} currentUsername={username} />
      )}
    </main>
  );
}
