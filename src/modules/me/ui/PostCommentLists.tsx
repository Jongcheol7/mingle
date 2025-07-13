//import { useState } from "react";
import CommentItem from "./CommentItem";
import { useCommentLists } from "@/hooks/useCommentLists";

type Props = {
  postId: number;
};

type Comment = {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    username: string;
    imageUrl: string;
  };
  parentId: number | null;
};

export default function PostCommentLists({ postId }: Props) {
  //const [comments, setComments] = useState<Comment[]>([]);
  const { data } = useCommentLists(postId);

  console.log("PostCommentLists. data : ", data);

  //모든 댓글을 모아보자.
  const allComments = data?.pages.flatMap((page) => {
    return page.comments;
  });

  //부모 댓글만 모아보자.
  const parentComments = data?.pages.flatMap((page) => {
    return page.comments.filter(
      (comment: Comment) => comment.parentId === null
    );
  });

  //특정 부모에 대한 대댓글을 필터링 해보자
  // const getReplies = (id: number) => {
  //   return data?.pages.flatMap((page) =>
  //     page.comments.filter((comment) => comment.parentId === id)
  //   );
  // };

  console.log("PostCommentLists. parentComments : ", parentComments);
  console.log("PostCommentLists. allComments : ", allComments);

  //부모 댓글만 모아보자.
  //const parentComments = comments.filter((c) => c.parentId === null);

  //특정 부모에 대한 대댓글 필터링 해보자.
  // const getReplies = (id: number) => {
  //   return comments.filter((c) => c.parentId === id);
  // };

  return (
    <div>
      {parentComments?.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          replies={allComments ?? []}
          depth={0}
          postId={postId}
        />
      ))}
    </div>
  );
}

// 더미 데이터
// type Comment = {
//   id: number;
//   content: string;
//   createdAt: string;
//   author: {
//     id: number;
//     username: string;
//     imageUrl: string;
//   };
//   parentId: number | null;
// };
/*
const dummyComments: Comment[] = [
  {
    id: 1,
    content:
      "첫번째 댓글이요 내용을 조금 더 길게 해볼까요?? 두줄로 표현하고 싶어요",
    createdAt: "2025-07-06",
    author: {
      id: 1,
      username: "홍길동",
      imageUrl: "/logo.svg",
    },
    parentId: null,
  },
  {
    id: 2,
    content: "첫번째에 대한 대댓글이요",
    createdAt: "2025-07-06",
    author: {
      id: 2,
      username: "김철수",
      imageUrl: "/logo.svg",
    },
    parentId: 1,
  },
  {
    id: 3,
    content: "두번째에 대한 대댓글이요",
    createdAt: "2025-07-06",
    author: {
      id: 3,
      username: "김영희",
      imageUrl: "/logo.svg",
    },
    parentId: 2,
  },
  {
    id: 4,
    content: "세번째에 대한 대댓글이요",
    createdAt: "2025-07-06",
    author: {
      id: 4,
      username: "둘리",
      imageUrl: "/logo.svg",
    },
    parentId: 3,
  },
  {
    id: 5,
    content: "너무 잘했어요",
    createdAt: "2025-07-06",
    author: {
      id: 1,
      username: "이민영",
      imageUrl: "/logo.svg",
    },
    parentId: null,
  },
];
*/
