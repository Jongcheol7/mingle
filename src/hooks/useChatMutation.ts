import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

//sender, receiver, isDirect, roomName, message, roomId
type MessageProps = {
  senderId: string;
  receiverId: string;
  isDirect: boolean;
  roomName: string;
  message: string;
  roomId: number;
};

export function useChatMutation() {
  return useMutation({
    mutationFn: async (data: MessageProps) => {
      const res = await axios.post("/api/chat", data);
      return res.data;
    },

    onError: (err) => {
      toast.error("메세지 보내기 실패 : " + err);
    },
  });
}
