"use client";
import { useUserStore } from "@/lib/store/useUserStore";
import Image from "next/image";
import { useEffect } from "react";
import { toast } from "sonner";

export default function MeProfile() {
  const { user } = useUserStore();

  useEffect(() => {
    if (!user) {
      toast.error("로그인 정보가 없습니다.");
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="flex items-center gap-4 ">
      <Image
        src={user.imageUrl}
        width={80}
        height={80}
        alt="프로필사진"
        className="rounded-full"
      />
      <p className="text-2xl font-semibold">{user?.username}</p>
      <div className="flex gap-2">
        <div className="flex flex-col items-center">
          <p className="text-gray-800 text-sm">버디</p>
          <p className="text-gray-600 text-sm">100</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-gray-800 text-sm">밈버</p>
          <p className="text-gray-600 text-sm">1,000</p>
        </div>
      </div>
    </div>
  );
}
