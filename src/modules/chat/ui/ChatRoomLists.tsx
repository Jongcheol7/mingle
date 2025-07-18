"use client";

import { useChatRoomLists } from "@/hooks/useChatRoomLists";
import { useUserStore } from "@/lib/store/useUserStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

type RoomType = {
  id: number;
  roomName: string;
  chatRoomMember: {
    id: number;
    userId: string;
    user: {
      clerkId: string;
      username: string;
      imageUrl: string;
    };
  }[];
};

export default function ChatRoomLists() {
  // 내가 참여하고 있는 채팅방 리스트 추출
  const { data } = useChatRoomLists();
  const { user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      toast.error("로그인 정보가 없습니다.");
      router.push("/");
    }
  }, [user, router]);

  console.log("ddd : ", data);

  return (
    <div>
      {data &&
        data.roomLists.map((room: RoomType) => {
          const notMe = room.chatRoomMember.filter(
            (member) => member.userId !== user!.id
          );
          return notMe.map((chatRoomMember) => (
            <div key={chatRoomMember.id} className="flex items-center gap-2">
              <Image
                src={chatRoomMember.user.imageUrl}
                width={30}
                height={30}
                alt="프로필사진"
                className="rounded-full"
              />
              <p>{room.roomName}</p>
            </div>
          ));
        })}
    </div>
  );
}
