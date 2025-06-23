"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UploadIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import ImageUpload from "./ImageUpload";

export default function UploadMain() {
  const [file, setFile] = useState<File[]>([]);
  const [fileType, setFileType] = useState<"image" | "video" | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        alert("사진이나 동영상만 업로드 가능합니다.");
        return false;
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

      setFile([...file, uploadFile]);
      setFileType(fileType);
    },
    [file]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "video/*": [],
    },
    multiple: false,
  });

  if (file && fileType === "image") {
    return <ImageUpload file={file} />;
  }
  if (file && fileType === "video") {
    return null;
  }

  return (
    <div className="flex h-screen min-h-screen">
      {/* <h1>동영상.사진 업로드</h1> */}
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
        <Button variant={"custom"}>파일 선택</Button>
      </Card>
    </div>
  );
}
