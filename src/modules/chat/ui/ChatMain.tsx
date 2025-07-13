"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useSocket from "@/hooks/useSocket";
import { useEffect, useState } from "react";

export default function ChatMain() {
  const socketRef = useSocket();
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    // 서버에서 메세지 받기
    socket.on("chat", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // 이벤트 중복 방지
    return () => {
      socket.off("chat");
    };
  }, [socketRef]);

  const handleSend = () => {
    const socket = socketRef.current;
    if (!socket || input.trim() === "") return;

    // 서버로 메세지 보내기
    socket.emit("chat", input);
    setInput("");
  };

  return (
    <div>
      <h1 className="text-xl font-bold my-4">실시간 채팅</h1>
      <div className="border h-64 p-2 mb-2 overflow-y-auto rounded bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-1">
            {msg}
          </div>
        ))}
      </div>
      <div className="flex gap-1">
        <Input
          type="text"
          value={input}
          placeholder="메세지를 입력하세요"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend}>보내기</Button>
      </div>
    </div>
  );
}
