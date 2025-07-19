"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { timeTransform } from "@/modules/common/TimeTransform";
import { RoomType } from "@/types/chat";
import { UserType } from "@/types/user";

type Props = {
  roomLists: RoomType[];
  user: UserType;
  setRoomInfo: (roomLists: RoomType) => void;
};

export default function ChatRoomLists({ roomLists, user, setRoomInfo }: Props) {
  // 마지막 채팅시간 구하기.

  return (
    <div className="mt-5">
      <h1 className="mb-5 text-xl font-bold">채팅 목록</h1>

      <div className="flex flex-col gap-2">
        {roomLists.map((room: RoomType) => {
          const notMe = room.chatRoomMember.filter(
            (member) => member.userId !== user?.id
          );

          const lastMessageDate = timeTransform(room.message[0].createdAt).date;

          return notMe.map((chatRoomMember) => (
            <button
              key={chatRoomMember.id}
              onClick={() => setRoomInfo(room)}
              className="flex justify-between items-center gap-3 p-3 rounded-md bg-gray-100 hover:bg-gray-200 transition"
            >
              <Avatar className="w-[33px]">
                <AvatarImage src={chatRoomMember.user.imageUrl} />
                <AvatarFallback>
                  {chatRoomMember.user.username[0]}
                </AvatarFallback>
              </Avatar>
              <div className="text-left flex-1">
                <p className="font-medium">{chatRoomMember.user.username}</p>
                <p className="text-sm text-muted-foreground">{room.roomName}</p>
              </div>
              <p className="w-[70px] text-[11px] tracking-tight text-gray-600">
                {lastMessageDate}
              </p>
            </button>
          ));
        })}
      </div>
    </div>
  );
}
