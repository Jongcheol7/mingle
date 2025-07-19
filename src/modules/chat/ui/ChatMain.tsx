"use client";

import { useChatRoomLists } from "@/hooks/useChatRoomLists";
import ChatPage from "./ChatPage";
import ChatRoomLists from "./ChatRoomLists";
import { useUserStore } from "@/lib/store/useUserStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RoomType } from "@/types/chat";

export default function ChatMain() {
  const { data } = useChatRoomLists();
  const { user } = useUserStore();
  const [roomInfo, setRoomInfo] = useState<RoomType | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      toast.error("로그인 정보가 없습니다.");
      router.push("/");
    }
  }, [user, router]);

  console.log("ddd : ", data);

  return (
    <div className="flex">
      <div className="w-[37%] mr-2">
        {data && user && (
          <ChatRoomLists
            roomLists={data.roomLists}
            user={user!}
            setRoomInfo={setRoomInfo}
          />
        )}
      </div>
      <div className="flex-1">
        {roomInfo && (
          <ChatPage
            roomInfo={roomInfo}
            user={user!}
            setRoomInfo={setRoomInfo}
          />
        )}
      </div>
    </div>
  );
}
