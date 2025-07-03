"use client";

import { useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useUploadStore } from "@/lib/store/useUploadStore";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { usePostMutation } from "@/hooks/usePostMutation";
import axios from "axios";
import imageCompression from "browser-image-compression";

type FormData = {
  title: string;
  content: string;
  tags: string[];
};

export default function UploadImageWrite() {
  const router = useRouter(); //라우터
  const { saveFiles, clearFiles } = useUploadStore(); //zustand 사용
  const [currentIdx, setCurrentIdx] = useState(0); //현재 보고있는 사진의 index
  //const [tags, setTags] = useState([]);
  //react-use-form 사용(컴포넌트전용)
  const { register, handleSubmit, setValue, watch, getValues, reset } =
    useForm<FormData>({
      defaultValues: { title: "", content: "", tags: [] },
    });
  watch("tags"); //watch를 통해 실시간 랜더링 유도

  const { mutate: saveMutate, isPending: isSaving } = usePostMutation();

  //zustand에 사진이 없으면 upload화면으로 이동
  useEffect(() => {
    if (saveFiles.length === 0) {
      router.replace("/post/new");
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
    try {
      //1.이미지들을 순차적으로 S3에 업로드하고, S3 URL을 배열로 수집
      const imageUrls: string[] = [];
      for (const file of saveFiles) {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 0.7,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        });
        const presignedRes = await axios.post("/api/post/upload/image", {
          fileType: compressedFile.type,
        });
        if (presignedRes.data.error) {
          throw new Error("Presined URL 생성실패");
        }
        const { uploadUrl, fileUrl } = presignedRes.data;

        //2. presigned URL로 S3에 실제 업로드
        await axios.put(uploadUrl, compressedFile, {
          headers: {
            "Content-Type": compressedFile.type,
          },
        });

        //3. 업로드 성공시 배열에 url 저장
        imageUrls.push(fileUrl);
      }

      //4. 기존 form데이터에 imageUrls도 포함.
      const finalData = {
        ...data,
        imageUrls,
      };
      saveMutate(finalData, {
        onSuccess: () => {
          clearFiles();
          reset();
          router.push("/");
        },
      });
    } catch (err) {
      console.log("이미지 업로드 중 오류 발생:", err);
      toast.error("이미지 업로드 중 오류 발생");
    }
  };

  return (
    <div className="flex h-screen">
      <Card className="flex-1 relative ml-5 mr-8 mt-8 px-1 h-[calc(100vh-70px)] flex flex-row shadow-xl">
        {/* 왼쪽 이미지 영역 */}
        <div className="relative w-[60%] bg-black overflow-hidden">
          {saveFiles.length > 1 && (
            <p className="absolute left-2 top-2 z-10 font-semibold text-red-200">
              {currentIdx + 1} / {saveFiles.length}
            </p>
          )}

          {currentIdx < saveFiles.length - 1 && (
            <button
              className="absolute right-2 top-[45%] z-20 bg-black/50 hover:bg-black p-2 rounded-full text-white"
              onClick={() => {
                setCurrentIdx(currentIdx + 1);
              }}
            >
              <ChevronRight />
            </button>
          )}

          {currentIdx > 0 && (
            <button
              className="absolute left-2 top-[45%] z-20 bg-black/50 hover:bg-black p-2 rounded-full text-white"
              onClick={() => {
                setCurrentIdx(currentIdx - 1);
              }}
            >
              <ChevronLeft />
            </button>
          )}

          {/* 필터 적용은 이미지에만 */}
          <div className="relative w-full h-full">
            <Cropper
              image={URL.createObjectURL(saveFiles[currentIdx])}
              crop={{ x: 0, y: 0 }}
              zoom={1}
              aspect={1}
              onCropChange={() => {}} // 임시로라도 넣어줘야 함
              onZoomChange={() => {}} // 이것도 필수 아님, 근데 warning 안뜨게 같이 넣어줘
              // 필터나 편집 기능이 없다면 여긴 그냥 미리보기 용
              style={{
                mediaStyle: { objectFit: "contain", cursor: "default" },
                containerStyle: { cursor: "default" }, // 컨테이너에 기본 커서 적용
                cropAreaStyle: { cursor: "default" }, // 자르기 영역에도
              }}
            />
          </div>
        </div>

        {/* 오른쪽 슬라이더 조절 */}
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
