import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Post = {
  content: string;
  tags: string[];
};

export function usePostMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Post) => {
      const res = await axios.post("/api/post/save", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("POST 저장 완료!");
      router.push("/");
    },
    onError: (err) =>
      toast.error("POST 저장 실패 : " + err?.message + ",서버 에러"),
  });
}
