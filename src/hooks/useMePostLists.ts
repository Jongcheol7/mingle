"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export function useMePostLists() {
  return useInfiniteQuery({
    queryKey: ["mePostLists"],
    queryFn: async ({ pageParam = null }) => {
      const res = await axios.get("/api/me/list", {
        params: { cursor: pageParam, limit: 10 },
      });
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ?? undefined;
    },
    initialPageParam: null,
  });
}
