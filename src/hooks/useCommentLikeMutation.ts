import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

type Comment = {
  id: number;
  likes: { userId: string }[];
};
type CommentPage = {
  nextCursor?: number;
  comments: Comment[];
};
type InfiniteCommentData = {
  pages: CommentPage[];
};

export function useCommentLikeMutation(postId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId: number) => {
      const res = await axios.post("/api/post/like/comment", {
        commentId: commentId,
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data.isliked) toast.success("좋아요 완료");
      else toast.success("좋아요 취소완료");

      // 옵티미스틱 업데이트 해보자!
      queryClient.setQueryData<InfiniteCommentData>(
        ["commentLists", postId],
        (oldData) => ({
          ...oldData,
          pages: oldData!.pages.map((page) => ({
            ...page,
            comments: page.comments.map((comment) =>
              comment.id === data.commentId
                ? {
                    ...comment,
                    likes: data.liked
                      ? [...comment.likes, { userId: "me" }]
                      : comment.likes.filter((like) => like.userId !== "me"),
                  }
                : comment
            ),
          })),
        })
      );
    },
    onError: (err) => {
      toast.error("좋아요 처리중 오류 발생 :" + err);
    },
  });
}
