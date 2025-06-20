"use client";
import { useAuth, useClerk } from "@clerk/nextjs";

export default function Home() {
  const clerk = useClerk();
  const { isSignedIn } = useAuth();
  console.log("clerk : ", clerk);
  console.log("isSignedIn : ", isSignedIn);
  return (
    <div>
      <p>테스트 홈페이지</p>
    </div>
  );
}
