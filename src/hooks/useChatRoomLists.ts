import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useChatRoomLists() {
  return useQuery({
    queryKey: ["chatRoomLists"],
    queryFn: async () => {
      const res = await axios.get("/api/chat/rooms");
      return res.data;
    },
  });
}
