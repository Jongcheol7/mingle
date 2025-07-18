import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export function useChatMessage(roomId: number) {
  return useInfiniteQuery({
    queryKey: ["ChatMessages", roomId],
    queryFn: async ({ pageParam = null, queryKey }) => {
      const [, roomId] = queryKey;
      const res = await axios.get("/api/chat/messages", {
        params: { roomId, cursor: pageParam, limit: 10 },
      });
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ?? undefined;
    },
    initialPageParam: null,
  });
}
