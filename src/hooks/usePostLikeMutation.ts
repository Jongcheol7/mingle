import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export function usePostLikeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: number) => {
      const res = await axios.post("/post/like", {
        postId: postId,
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data.liked) toast.success("좋아요 완료");
      else toast.success("좋아요 취소완료");

      queryClient.setQueryData(["postLists"], (oldData: any) => ({
        ...oldData,
        pages: oldData.pages.map((page: any) => ({
          ...page,
          posts: page.posts.map((post: any) =>
            post.id === data.postId
              ? {
                  ...post,
                  likes: data.liked
                    ? [...post.likes, { userId: "me" }]
                    : post.likes.filter((like: any) => like.userId !== "me"),
                }
              : post
          ),
        })),
      }));
    },
    onError: (err) => {
      toast.error("좋아요 처리중 오류 발생 :" + err);
    },
  });
}
