"use client";

import { useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useUploadImageStore } from "@/lib/store/useUploadImageStore";
import { useRouter } from "next/navigation";

export default function UploadWrite() {
  const { saveFiles } = useUploadImageStore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (saveFiles.length === 0) {
      router.replace("/post/new");
    }
  }, [saveFiles, router]);

  // 현재 이미지 파일로부터 blob URL 생성 (변경될 때마다 실행)
  useEffect(() => {
    if (saveFiles.length > 0) {
      const url = URL.createObjectURL(saveFiles[currentIdx]);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [saveFiles, currentIdx]);

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
              image={imageUrl}
              crop={{ x: 0, y: 0 }}
              zoom={1}
              aspect={1}
              onCropChange={() => {}} // 임시로라도 넣어줘야 함
              onZoomChange={() => {}} // 이것도 필수 아님, 근데 warning 안뜨게 같이 넣어줘
              // 필터나 편집 기능이 없다면 여긴 그냥 미리보기 용
              style={{
                mediaStyle: { objectFit: "contain" },
              }}
            />
          </div>
        </div>

        {/* 오른쪽 슬라이더 조절 */}
        <div className="w-[40%] p-6 bg-white overflow-y-auto">
          <div className="flex justify-end mb-4">
            <Button variant="outline" className="text-sm px-3 py-1">
              저장
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
