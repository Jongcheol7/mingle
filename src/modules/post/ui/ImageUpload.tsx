"use client";
import { Card } from "@/components/ui/card";
import { useState } from "react";

type Props = {
  file: File;
};

export default function ImageUpload({ file }: Props) {
  const [files, setFiles] = useState(file);
  return (
    <div className="h-screen min-h-screen">
      {/* <h1>동영상.사진 업로드</h1> */}
      <Card className="ml-5 mr-10 px-1 my-10 h-[calc(100vh-70px)] flex flex-row items-center justify-center shadow-xl">
        <p>사진공간</p>
        <div className="flex flex-col">
          <p>내용공간</p>
          <p>설정공간</p>
        </div>
      </Card>
    </div>
  );
}
