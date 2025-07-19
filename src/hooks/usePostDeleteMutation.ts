import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

type Props = {
  postId: number;
  onClose: (value: boolean) => void;
};

export function usePostDeleteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId }: Props) => {
      const res = await axios.delete(`/api/post/save?postId=${postId}`);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["mePostLists"] });
      queryClient.invalidateQueries({ queryKey: ["postLists"] });
      variables.onClose(false);
      toast.success("게시글이 삭제되었습니다!");
    },
    onError: (err) =>
      toast.error("게시글 삭제 실패 : " + err?.message + ", 서버 에러"),
  });
}
