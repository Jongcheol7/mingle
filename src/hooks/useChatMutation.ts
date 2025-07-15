import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export function useChatMutation() {
  return useMutation({
    mutationFn: async () => {
      const res = await axios.post("/api/chat");
      return res.data;
    },
    onSuccess: (data) => {},
    onError: (err) => {
      toast.error("메세지 보내기 실패 : " + err);
    },
  });
}
