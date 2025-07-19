"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export function usePostLists() {
  return useInfiniteQuery({
    queryKey: ["postLists"],
    queryFn: async ({ pageParam = null }) => {
      const res = await axios.get("/api/post/list", {
        params: { cursor: pageParam, limit: 10 },
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
