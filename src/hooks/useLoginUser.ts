"use client";
import { useUserStore } from "@/lib/store/useUserStore";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

// 유저 타입 정의
type LoginUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
};

export function useLoginUser() {
  const { setUser, clearUser } = useUserStore();

  const { data, error, isSuccess, isError, refetch } = useQuery<
    LoginUser,
    Error
  >({
    queryKey: ["loginUser"],
    queryFn: async () => {
      const res = await axios.get("/api/users/me");
      return res.data;
    },
    retry: 0,
  });

  useEffect(() => {
    if (isSuccess && data) {
      setUser(data);
    }
    if (isError) {
      console.log("리엑트 쿼리에서 DB user 데이터 조회 실패", error);
      clearUser();
    }
  }, [data, isSuccess, setUser, isError, clearUser, error]);

  return {
    data,
    error,
    refetch,
  };
}
