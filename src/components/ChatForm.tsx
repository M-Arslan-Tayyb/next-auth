"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  onRoomJoin: (roomId: string) => void;
}

export default function ChatForm({ onRoomJoin }: Props) {
  const [roomId, setRoomId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (/^\d{5}$/.test(roomId)) {
      onRoomJoin(roomId);
    } else {
      alert("Room ID must be exactly 5 digits.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-x-2 flex">
      <Input
        type="text"
        placeholder="Enter 5-digit Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="w-64"
        maxLength={5}
      />
      <Button type="submit">Join</Button>
    </form>
  );
}
