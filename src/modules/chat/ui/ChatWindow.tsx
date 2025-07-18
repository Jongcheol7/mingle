// components/ChatWindow.tsx
"use client";

import { useChatMessage } from "@/hooks/useChatMessages";
import useSocket from "@/hooks/useSocket";
import { useUserStore } from "@/lib/store/useUserStore";
import { timeTransform } from "@/modules/common/TimeTransform";
import axios from "axios";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type ChatWindowProps = {
  receiverName: string;
  receiverUrl: string;
  receiverId: string;
  onClose: () => void;
};

type MessageType = {
  senderId: string;
  receiverId: string;
  senderName: string;
  receiverName: string;
  isDirect: boolean;
  roomName: string;
  message: string;
  roomId: number | undefined;
  createdAt?: Date;
};

export default function ChatWindow({
  receiverName,
  receiverUrl,
  receiverId,
  onClose,
}: ChatWindowProps) {
  const socketRef = useSocket();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { user } = useUserStore();
  const [roomId, setRoomId] = useState(null);

  // 1:1 채팅 방번호 불러오기
  useEffect(() => {
    if (!user) {
      toast.error("로그인 정보가 없습니다.");
    }
    const fetchRoomId = async () => {
      try {
        const res = await axios.get("/api/chat/room", {
          params: { senderId: user!.id, receiverId },
        });
        setRoomId(res.data.roomId);
      } catch (err) {
        console.error("채팅방 조회 실패", err);
        toast.error("채팅방을 가져오지 못했습니다.");
      }
    };
    fetchRoomId();
  }, [user, receiverId, setRoomId]);

  // 채팅 내용 조회하기
  const { data, isSuccess } = useChatMessage(roomId ?? 0);
  useEffect(() => {
    if (isSuccess && data.pages) {
      const allMessages = data.pages.flatMap((page) => page.result).reverse();
      setMessages(allMessages);
    }
  }, [data, isSuccess]);

  console.log("ddd: ", messages);

  // 스크롤 하단 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 소켓 메세지 송수신
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    // 서버에서 메세지 받기
    socket.on("chat", (message: MessageType) => {
      setMessages((prev) => [...prev, message]);
    });

    // 이벤트 중복 방지
    return () => {
      socket.off("chat");
    };
  }, [socketRef, receiverId]);

  // 보내기 버튼 클릭시
  const handleSend = () => {
    const socket = socketRef.current;
    if (!socket || input.trim() === "") return;

    // 서버로 메세지 보내기
    socket.emit("chat", {
      senderId: user!.id,
      receiverId,
      senderName: user!.username,
      receiverName,
      isDirect: true,
      roomName: receiverName,
      message: input,
      roomId: roomId ?? 0,
    });
    setInput("");
  };

  return (
    <div className="fixed bottom-4 right-4 w-[350px] h-[400px] bg-white border shadow-xl rounded-xl flex flex-col z-50">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex gap-1 items-center">
          <Image
            src={receiverUrl}
            alt="profileImage"
            width={30}
            height={30}
            priority
            className="rounded-full mr-1"
          />
          <span className="font-semibold">{receiverName}</span>
        </div>
        <button onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 p-3 overflow-y-auto max-h-[300px] scrollbar-none">
        {messages.map((msg: MessageType, idx) => {
          const isMe = msg.senderId === user?.id;
          return (
            <div
              key={idx}
              className={`flex w-full mb-1 ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-end gap-1 ${
                  isMe ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`max-w-[75%] break-words rounded-xl px-2 py-1 text-sm ${
                    isMe ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  {msg.message}
                </div>
                <div className="text-[10px] text-gray-500 leading-none">
                  <div>{timeTransform(msg.createdAt!).date}</div>
                  <div className={`${isMe ? "text-right" : "text-left"}`}>
                    {timeTransform(msg.createdAt!).time}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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
