"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ChatWindow from "@/modules/chat/ui/ChatWindow";
import { EllipsisIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type Post = {
  post: {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    postId: number;
    user: {
      username: string;
      imageUrl: string;
      clerkId: string;
    };
  };
};

const formatDate = (date: string) => {
  const formatDate = new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return formatDate;
};

export default function PostHeader({ post }: Post) {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <div className="flex items-center w-full justify-between px-3 mb-2">
        <div className="flex items-center">
          <Image
            src={post.user.imageUrl}
            alt="profileImage"
            width={30}
            height={30}
            priority
            className="rounded-full mr-1"
          />
          <span>{post.user.username}</span>
          <span className="text-[11px] tracking-tight ml-2 mt-1">
            {formatDate(post.createdAt)}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <EllipsisIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>친구추가</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="mt-1 cursor-pointer"
              onClick={() => setChatOpen(!chatOpen)}
            >
              메세지
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 채팅창 띄우기 */}
      {chatOpen && (
        <ChatWindow
          receiverName={post.user.username}
          receiverUrl={post.user.imageUrl}
          receiverId={post.user.clerkId}
          onClose={() => setChatOpen(false)}
        />
      )}
    </>
  );
}
