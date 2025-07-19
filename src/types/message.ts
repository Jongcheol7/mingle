export type MessageType = {
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
