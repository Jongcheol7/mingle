"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UploadIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { useUploadImageStore } from "@/lib/store/useUploadImageStore";
import { toast } from "sonner";
import {
  DragDropContext, // 드래그 전체를 감싸는 컨텍스트
  Draggable, // 실제 드래그할 수 있는 아이템
  Droppable, // 드래그한 아이템을 놓을 수 있는 영역
  DropResult, // 드래그 후 결과 객체의 타입
} from "@hello-pangea/dnd";

export default function UploadMain() {
  const router = useRouter();
  const { setSaveFiles, clearFiles } = useUploadImageStore(); // ✅ Zustand에 파일 저장하는 함수
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);

  useEffect(() => {
    clearFiles();
  }, [clearFiles]);

  // ✅ 파일 드롭 or 선택 시 실행될 콜백
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      toast.error("사진이나 동영상만 업로드 가능합니다.");
      return;
    }

    if (
      acceptedFiles[0].type.startsWith("image") &&
      uploadFiles.length + acceptedFiles.length > 4
    ) {
      toast.error("사진은 최대 4장까지 첨부할수 있습니다.");
      return;
    }

    let imgCnt = 0;
    let videoCnt = 0;
    for (let i = 0; i < acceptedFiles.length; i++) {
      if (acceptedFiles[i].type.startsWith("image")) imgCnt++;
      if (acceptedFiles[i].type.startsWith("video")) videoCnt++;
    }
    if (imgCnt > 0 && videoCnt > 0) {
      toast.error("사진과 동영상을 한번에 게시할수 없습니다.");
      return;
    }

    setUploadFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  // ✅ useDropzone 훅으로 drag & drop 처리 설정
  // getRootProps, getInputProps, isDragActive 는 리턴값 onDrop은 callback
  // getRootProps : 드래그 가능한 영역을 만들때
  // getInputProps : input 에 연결됨
  // isDragActive : 드래그 중일때 true가 되어서 안내문구 보여주는 용도
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "video/*": [],
    },
    multiple: true, // 한 번에 하나만 받도록 설정
    noClick: true, //open 으로 지정한 버튼만 클릭할때 팝업열리도록
  });

  /* 순서 변경 핸들러 */
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return; //드롭 위치가 없으면 무시
    const reordered = Array.from(uploadFiles);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.source.index, 0, removed);
    setUploadFiles(reordered);
  };

  /* 사진 삭제 핸들러 */
  const handleDelete = (file: File) => {
    setUploadFiles(uploadFiles.filter((f) => f !== file));
  };

  /* 다음 버튼 클릭 핸들러 */
  const handleNext = () => {
    if (uploadFiles.length === 0) {
      toast.error("사진 혹은 동영상을 첨부하세요.");
      return;
    }
    if (uploadFiles[0].type.startsWith("image")) {
      // ✅ Zustand에 파일 저장
      setSaveFiles(uploadFiles);
      router.push("/post/new/image");
    }
  };

  return (
    <div>
      <Card
        {...getRootProps()}
        className="relative ml-5 mr-10 px-1 mt-8 h-[calc(100vh-70px)] flex flex-col items-center justify-center shadow-xl gap-4"
      >
        <Button
          variant={"custom"}
          className="absolute top-5 right-5"
          onClick={handleNext}
        >
          다음
        </Button>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="image-list" direction="horizontal">
            {(provided) => (
              <div
                className="absolute top-32 flex"
                ref={provided.innerRef}
                {...provided.droppableProps} // DnD가 드래그 허용되도록 필요한 속성
              >
                {uploadFiles.map((file, index) => (
                  <Draggable
                    key={`${file.name}-${file.lastModified}`}
                    draggableId={`${file.name}-${file.lastModified}`}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div className="relative w-[200px] h-[200px] px-1 ">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-full cursor-default rounded-xl"
                          />
                          <button
                            className="absolute top-0 right-1 bg-black/40 rounded-tr-xl text-white text-center  text-[10px] px-2 py-2 hover:bg-red-500 transition"
                            onClick={() => handleDelete(file)}
                          >
                            ❌
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div className="absolute bottom-40 flex flex-col items-center gap-3">
          <input {...getInputProps()} className="hidden" />

          <UploadIcon className="w-12 h-12 text-muted-foreground" />
          <p className="font-semibold text-muted-foreground">
            {isDragActive
              ? "여기에 파일을 놓아주세요"
              : "사진이나 동영상을 드래그하거나 아래 버튼을 눌러 선택하세요"}
          </p>

          {/* ✅ 버튼 클릭 시 open()으로만 파일창 열림 */}
          <Button variant="custom" onClick={open}>
            파일 선택
          </Button>
        </div>
      </Card>
    </div>
  );
}
