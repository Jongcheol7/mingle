import { Textarea } from "@/components/ui/textarea";
import { useCommentMutation } from "@/hooks/useCommentMutation";
import { useForm } from "react-hook-form";

type FormData = {
  content: string;
};

export default function CommentForm() {
  const { register, handleSubmit, getValues } = useForm();
  const { mutate: saveCommentMutate, isPending: isCommenting } =
    useCommentMutation();
  const onSubmit = (data: FormData) => {};
  return (
    <div className="mt-3">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Textarea {...register("content")} placeholder="댓글을 입력하세요" />
        <div className="flex justify-end mt-1 mr-1">
          <button className="bg-black text-white px-2 py-1 rounded text-sm cursor-pointer hover:bg-gray-800 transition">
            {isCommenting ? "등록중" : "등록"}
          </button>
        </div>
      </form>
    </div>
  );
}
