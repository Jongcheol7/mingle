"use client";

import ChatPage from "./ChatPage";
import ChatRoomLists from "./ChatRoomLists";

export default function ChatMain() {
  return (
    <div className="flex">
      <div className="w-[30%]">
        <ChatRoomLists />
      </div>
      <div className="flex-1">
        <ChatPage />
      </div>
    </div>
  );
}
