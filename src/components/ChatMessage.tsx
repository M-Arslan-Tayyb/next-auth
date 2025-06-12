"use client";

import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { socket } from "@/lib/SocketClient";

interface Props {
  roomId: string;
  currentUsername: string;
}

interface Chat {
  id: number;
  message: string;
  type: "sender" | "receiver" | "system";
  username: string;
}

export default function ChatMessage({ roomId, currentUsername }: Props) {
  const [messages, setMessages] = useState<Chat[]>([]);
  const [input, setInput] = useState("");

  const hasJoinedRef = useRef(false);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    // Prevent multiple joins and multiple event bindings
    if (!hasJoinedRef.current) {
      hasJoinedRef.current = true;

      socket.emit("join-room", { roomId, username: currentUsername });

      socket.on("user-joined", ({ username }) => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            message: `${username} joined the room`,
            type: "system",
            username,
          },
        ]);
      });

      socket.on("receive-message", ({ message, sender }) => {
        const isMe = sender === currentUsername;

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            message,
            type: isMe ? "sender" : "receiver",
            username: sender,
          },
        ]);
      });
    }

    return () => {
      socket.off("user-joined");
      socket.off("receive-message");
      hasJoinedRef.current = false;
    };
  }, [roomId, currentUsername]);

  const sendMessage = () => {
    if (!input.trim()) return;

    socket.emit("send-message", {
      roomId,
      message: input,
      sender: currentUsername,
    });

    setInput("");
  };

  const getMessageAlignment = (type: Chat["type"]) => {
    switch (type) {
      case "sender":
        return "justify-end text-right";
      case "receiver":
        return "justify-start text-left";
      case "system":
        return "justify-center text-center text-gray-500 italic";
      default:
        return "";
    }
  };

  const getMessageBgColor = (type: Chat["type"]) => {
    switch (type) {
      case "sender":
        return "bg-purple-100";
      case "receiver":
        return "bg-orange-100";
      case "system":
        return "bg-gray-700 text-white";
      default:
        return "";
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-4">
      <h3 className="text-lg font-semibold">
        Room ID: <span className="text-purple-600">{roomId}</span>
      </h3>

      <div className="border h-64 overflow-y-auto p-3 rounded-lg bg-muted flex flex-col space-y-2">
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">No messages yet...</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${getMessageAlignment(msg.type)}`}
            >
              <div
                className={`rounded-md px-3 py-2 max-w-[70%] ${getMessageBgColor(
                  msg.type
                )}`}
              >
                {msg.type !== "system" && (
                  <p className="text-sm font-semibold text-purple-700">
                    {msg.username}
                  </p>
                )}
                <p className="text-sm">{msg.message}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
}
