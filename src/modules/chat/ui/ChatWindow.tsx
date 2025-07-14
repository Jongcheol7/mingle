// components/ChatWindow.tsx
"use client";

import useSocket from "@/hooks/useSocket";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type ChatWindowProps = {
  username: string;
  userUrl: string;
  onClose: () => void;
};

export default function ChatWindow({
  username,
  userUrl,
  onClose,
}: ChatWindowProps) {
  const socketRef = useSocket();
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  // 보내기 버튼 클릭시
  const handleSend = () => {
    const socket = socketRef.current;
    if (!socket || input.trim() === "") return;

    // 서버로 메세지 보내기
    socket.emit("chat", input);
    setInput("");
  };

  return (
    <div className="fixed bottom-4 right-4 w-[350px] h-[400px] bg-white border shadow-xl rounded-xl flex flex-col z-50">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex gap-1 items-center">
          <Image
            src={userUrl}
            alt="profileImage"
            width={30}
            height={30}
            priority
            className="rounded-full mr-1"
          />
          <span className="font-semibold">{username}</span>
        </div>
        <button onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 p-3 overflow-y-auto max-h-[300px] scrollbar-none">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2 bg-gray-100 rounded p-2 text-sm">
            {msg}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex border-t p-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
          className="flex-1 px-2 py-1 border rounded mr-2 text-sm"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="text-sm bg-blue-500 text-white px-3 py-1 rounded"
        >
          보내기
        </button>
      </div>
    </div>
  );
}
