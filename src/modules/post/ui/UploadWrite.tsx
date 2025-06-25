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
  const [tags, setTags] = useState([]);

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

  // 태그 추가 이벤트
  const handleTagsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return; // 한글 조합 중이면 무시
    const keys = ["Enter", "Tab"];
    if (keys.includes(e.key)) {
      e.preventDefault();
      if (tags.length >= 10) {
        return alert("태그는 최대 10개까지 추가 가능합니다.");
      }
      const value = e.currentTarget.value.trim().toLowerCase();
      if (value && !tags.includes(value)) {
        setTags((prev) => [...prev, value]);
        e.target.value = "";
      }
    }
  };

  // 태그 삭제 이벤트
  const handleTagDelete = (deleteTag) => {
    setTags((prev) => prev.filter((tag) => tag !== deleteTag));
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
          <div>
            <textarea placeholder="내용을 입력하세요." />
            {/* 태그 */}
            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                태그
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      onClick={() => handleTagDelete(tag)}
                      className="ml-2 text-green-600 hover:text-red-500 font-bold"
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Enter나 Tab으로 태그 추가"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                onKeyDown={handleTagsKeyDown}
              />
              <input
                type="hidden"
                name="tags"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={tags.join(",")}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
