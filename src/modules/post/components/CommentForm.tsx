import { Textarea } from "@/components/ui/textarea";
import { useCommentMutation } from "@/hooks/useCommentMutation";
import { useForm } from "react-hook-form";

type FormData = {
  content: string;
};
type Prop = {
  postId: number;
  parentId?: number | null;
};

export default function CommentForm({ postId, parentId = null }: Prop) {
  const { register, handleSubmit, setValue } = useForm<FormData>();
  const {
    mutate: saveCommentMutate,
    isPending: isCommenting,
    isSuccess,
  } = useCommentMutation();

  const onSubmit = (data: FormData) => {
    saveCommentMutate({
      postId: postId,
      content: data.content,
      parentId: parentId,
    });
  };

  if (isSuccess) {
    setValue("content", "");
  }

  return (
    <div className="mt-3">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-1">
          <Textarea
            {...register("content")}
            placeholder="댓글을 입력하세요"
            className="flex-1"
          />
          <button className="flex self-center bg-black text-white px-2 py-1 rounded text-sm cursor-pointer hover:bg-gray-800 transition">
            {isCommenting ? "등록중" : "등록"}
          </button>
        </div>
      </form>
    </div>
  );
}
