"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export function usePostLists(option: string, keyword: string) {
  return useInfiniteQuery({
    queryKey: ["postLists", option, keyword],
    queryFn: async ({ pageParam = null }) => {
      const res = await axios.get("/api/post/list", {
        params: { cursor: pageParam, limit: 10, option, keyword },
      });
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ?? undefined;
    },
    initialPageParam: null,
    staleTime: 0,
  });
}
