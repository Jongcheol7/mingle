import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

type Post = {
  id: number;
  likes: { userId: string }[];
};
type PostPage = {
  nextCursor?: number;
  posts: Post[];
};
type InfinitePostData = {
  pages: PostPage[];
};

export function usePostLikeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: number) => {
      const res = await axios.post("/api/post/like/post", {
        postId: postId,
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data.liked) toast.success("좋아요 완료");
      else toast.success("좋아요 취소완료");

      // 옵티미스틱 업데이트 해보자!
      queryClient.setQueryData<InfinitePostData>(["postLists"], (oldData) => ({
        ...oldData,
        pages: oldData!.pages.map((page) => ({
          ...page,
          posts: page.posts.map((post) =>
            post.id === data.postId
              ? {
                  ...post,
                  likes: data.liked
                    ? [...post.likes, { userId: "me" }]
                    : post.likes.filter((like) => like.userId !== "me"),
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
