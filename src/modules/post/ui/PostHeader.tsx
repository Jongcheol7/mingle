"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePostDeleteMutation } from "@/hooks/usePostDeleteMutation";
import { useUserStore } from "@/lib/store/useUserStore";
import ChatWindow from "@/modules/chat/ui/ChatWindow";
import { Post } from "@/types/post";
import { EllipsisIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const formatDate = (date: string) => {
  const formatDate = new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return formatDate;
};

type Props = {
  post: Post;
  onClose: (value: boolean) => void;
};

export default function PostHeader({ post, onClose }: Props) {
  const [chatOpen, setChatOpen] = useState(false);
  const { user } = useUserStore();
  const { mutate: deleteMutate, isPending: isDeleting } =
    usePostDeleteMutation();
  console.log("디테일 헤더 ddd: ", post);
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
          {user?.id !== post.user.clerkId ? (
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
          ) : (
            <DropdownMenuContent>
              <DropdownMenuItem>수정</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className={`mt-1 cursor-pointer ${
                  isDeleting ? "disabled" : ""
                }`}
                onClick={() => {
                  const confirmDelete =
                    window.confirm("정말 삭제하시겠습니까?");
                  if (confirmDelete) {
                    deleteMutate({ postId: post.id, onClose });
                  }
                }}
              >
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
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
