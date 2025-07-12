import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export function useCommentLists(postId: number) {
  return useInfiniteQuery({
    queryKey: ["commentLists", postId],
    queryFn: async ({ pageParam = null, queryKey }) => {
      const [, postId] = queryKey;
      const res = await axios.get("/api/post/comment", {
        params: { postId, cursor: pageParam, limit: 10 },
      });
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ?? undefined;
    },
    initialPageParam: null,
  });
}
