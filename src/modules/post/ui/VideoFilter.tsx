"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUploadStore } from "@/lib/store/useUploadStore";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { usePostMutation } from "@/hooks/usePostMutation";
import axios from "axios";

type FormData = {
  title: string;
  content: string;
  tags: string[];
};

export default function VideoFilter() {
  const router = useRouter(); //라우터
  const { saveFiles, clearFiles } = useUploadStore(); //zustand 사용
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  //react-use-form 사용(컴포넌트전용)
  const { register, handleSubmit, setValue, watch, getValues, reset } =
    useForm<FormData>({
      defaultValues: { title: "", content: "", tags: [] },
    });
  watch("tags"); //watch를 통해 실시간 랜더링 유도

  const { mutate: saveMutate, isPending: isSaving } = usePostMutation();

  //zustand에 사진이 없으면 upload화면으로 이동
  useEffect(() => {
    if (!saveFiles || saveFiles.length === 0) {
      router.replace("/post/new");
    } else {
      const preview = URL.createObjectURL(saveFiles[0]);
      setPreviewUrl(preview);
      //메모리 누수 방지용 cleanup
      return () => URL.revokeObjectURL(preview);
    }
  }, [saveFiles, router]);

  // 태그 추가 이벤트
  const handleTagsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return; // 한글 조합 중이면 무시
    const keys = ["Enter", "Tab"];
    if (keys.includes(e.key)) {
      e.preventDefault();
      const rawValue = e.currentTarget.value.trim().toLowerCase();
      const currentTags = getValues("tags");
      if (currentTags.length >= 10) {
        toast.error("태그는 최대 10개까지 추가 가능합니다.");
        return;
      }

      if (rawValue && !currentTags.includes(rawValue)) {
        const newTags = [...currentTags, rawValue];
        setValue("tags", newTags);
        e.currentTarget.value = "";
      }
    }
  };

  // 태그 삭제 이벤트
  const handleTagDelete = (deleteTag: string) => {
    const currentTags = getValues("tags");
    const newTags = currentTags.filter((tag) => tag !== deleteTag);
    setValue("tags", newTags);
  };

  // Form 제출 이벤트
  const onSubmit = async (data: FormData) => {
    if (!saveFiles || saveFiles.length === 0) {
      toast.error("영상이 없습니다.");
      return;
    }

    try {
      //1. Mux 업로드 Url 생성
      const presignedRes = await axios.post("/api/post/upload/video");
      if (presignedRes.data.error) {
        throw new Error("Presined URL 생성실패");
      }

      const { url, id, error } = presignedRes.data;
      if (error || !url || !id) throw new Error("Presigned URL 생성 실패");

      //2. presigned URL로 Mux 에 실제 업로드
      await axios.put(url, saveFiles[0], {
        headers: {
          "Content-Type": saveFiles[0].type,
        },
      });

      //4. 기존 form데이터에 mux url 도 포함.
      const finalData = {
        ...data,
        muxUploadId: id,
      };
      saveMutate(finalData, {
        onSuccess: () => {
          clearFiles();
          reset();
        },
      });
    } catch (err) {
      console.log("동영상 업로드 중 오류 발생:", err);
      toast.error("동영상 업로드 중 오류 발생");
    }
  };

  return (
    <div className="flex h-screen">
      <Card className="flex-1 relative ml-5 mr-8 mt-8 px-1 h-[calc(100vh-70px)] flex flex-row shadow-xl">
        {/* 왼쪽 : 비디오 */}
        <div className="relative w-[60%] bg-black overflow-hidden">
          {previewUrl ? (
            <video
              src={previewUrl}
              controls
              className="max-w-full max-h-full rounded"
            />
          ) : (
            <p>비디오 없음</p>
          )}
        </div>

        {/* 오른쪽 : 폼 */}
        <div className="w-[40%] pr-1 bg-white overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-end mb-4 gap-2">
              <Button
                variant="outline"
                className="text-sm px-3 py-1"
                onClick={() => {
                  router.push("/post/new/image");
                }}
              >
                이전
              </Button>
              <Button
                type="submit"
                variant="outline"
                className="text-sm px-3 py-1"
                disabled={isSaving}
              >
                {isSaving ? "저장중" : "저장"}
              </Button>
            </div>

            <Input
              {...register("title")}
              type="text"
              placeholder="제목을 입력하세요"
              className="w-full border border-gray-300 rounded px-3 mt-2 py-2 focus:outline-none focus:ring-1"
            />

            <Textarea
              {...register("content")}
              placeholder="내용을 입력하세요."
              className="w-full mt-2 text-sm resize-none h-[100px] sm:h-[100px] md:h-[150px] lg:h-[200px] xl:h-[250px] border-gray-300 focus:ring-1"
            />
            {/* 태그 */}

            <Input
              type="text"
              placeholder="Enter나 Tab으로 태그 추가"
              className="w-full border border-gray-300 rounded px-3 mt-2 py-2 focus:outline-none focus:ring-1"
              onKeyDown={handleTagsKeyDown}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {getValues("tags").map((tag) => (
                <span
                  key={tag}
                  className="flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-red-300 transition-all"
                  onClick={() => handleTagDelete(tag)}
                >
                  # {tag}
                </span>
              ))}
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
