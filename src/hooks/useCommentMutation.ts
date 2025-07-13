import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

type CommentProp = {
  postId: number;
  content: string;
  parentId?: number | null;
};

export function useCommentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ postId, content, parentId = null }: CommentProp) => {
      const res = await axios.post("/api/post/comment", {
        postId,
        content,
        parentId,
      });
      return res.data;
    },
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("댓글 저장완료");
        queryClient.invalidateQueries({
          queryKey: ["commentLists", variables.postId],
        });
      }
    },
    onError: (err) => {
      toast.error("댓글 저장중 오류 발생: " + err);
    },
  });
}
