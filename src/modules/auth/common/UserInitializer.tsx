"use client";
import { useLoginUser } from "@/hooks/useLoginUser";

export default function UserInitializer() {
  useLoginUser();
  return null;
}
