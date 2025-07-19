export type RoomType = {
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
  message: {
    id: number;
    roomId: number;
    message: string;
    senderId: string;
    createdAt: Date;
  }[];
};
