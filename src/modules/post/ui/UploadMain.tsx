"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UploadIcon } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { useUploadImageStore } from "@/lib/store/useUploadImageStore";

export default function UploadMain() {
  const router = useRouter();
  const { setSaveFiles, clearFiles } = useUploadImageStore(); // ✅ Zustand에 파일 저장하는 함수

  useEffect(() => {
    clearFiles();
  }, [clearFiles]);

  // ✅ 파일 드롭 or 선택 시 실행될 콜백
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        alert("사진이나 동영상만 업로드 가능합니다.");
        return;
      }

      const uploadFile = acceptedFiles[0];

      const fileType = uploadFile.type.startsWith("image")
        ? "image"
        : uploadFile.type.startsWith("video")
        ? "video"
        : null;

      if (!fileType) {
        alert("이미지 또는 동영상만 업로드 가능합니다.");
        return;
      }

      // ✅ Zustand에 파일 저장
      setSaveFiles([uploadFile]);

      // ✅ 이미지면 페이지 이동
      if (fileType === "image") {
        router.push("/post/new/image");
      }

      // ⚠️ 동영상은 아직 처리 안 함
    },
    [router, setSaveFiles]
  );

  // ✅ useDropzone 훅으로 drag & drop 처리 설정
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "video/*": [],
    },
    multiple: false, // 한 번에 하나만 받도록 설정
  });

  return (
    <div className="flex h-screen min-h-screen">
      <Card
        {...getRootProps()}
        className="flex-1 ml-5 mr-10 px-1 mt-8 h-[calc(100vh-70px)] flex items-center justify-center shadow-xl"
      >
        <input {...getInputProps()} />
        <UploadIcon className="w-12 h-12 text-muted-foreground" />
        <p className="font-semibold text-muted-foreground">
          {isDragActive
            ? "여기에 파일을 놓아주세요"
            : "사진이나 동영상을 끌어다 놓거나 클릭하여 선택하세요"}
        </p>
        <Button variant="custom">파일 선택</Button>
      </Card>
    </div>
  );
}
