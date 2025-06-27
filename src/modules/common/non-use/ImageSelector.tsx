"use client";

import {
  DragDropContext, // 드래그 전체를 감싸는 컨텍스트
  Draggable, // 실제 드래그할 수 있는 아이템
  Droppable, // 드래그한 아이템을 놓을 수 있는 영역
  DropResult, // 드래그 후 결과 객체의 타입
} from "@hello-pangea/dnd";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

/** 타입 선언 */
type Props = {
  files: File[]; // 부모로부터 전달받는 이미지 파일들
  setShowImgList: (value: boolean) => void; // 이미지 리스트 창 닫기용 함수
  setFiles: (value: File[]) => void;
  setCurrentIdx: (value: number) => void;
};

export default function ImageSelector({
  files,
  setShowImgList,
  setFiles,
  setCurrentIdx,
}: Props) {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null); // 파일 input DOM을 직접 조작하기 위한 ref

  useEffect(() => {
    setImageFiles(files);
  }, [files]);

  /** 순서 변경 핸들러 */
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return; // 드롭 위치가 없으면 무시

    const reordered = Array.from(imageFiles); // 배열 복사
    const [removed] = reordered.splice(result.source.index, 1); // 기존 위치 제거
    reordered.splice(result.destination.index, 0, removed); // 새로운 위치에 삽입

    setImageFiles(reordered); // 새로운 배열로 업데이트
  };

  /** 삭제 */
  const handleDelete = (targetFile: File) => {
    setImageFiles((prev) => prev.filter((f) => f !== targetFile));
  };

  /** 파일 추가 */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    setImageFiles((prev) => [...prev, ...selected]);
  };

  return (
    <>
      <div className="absolute bottom-15 text-white px-3 bg-gray-800/80  rounded-md shadow-lg w-full h-40">
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-semibold py-3">📸 이미지 정렬 및 추가</h1>
          <div>
            <button
              className="mt-1 text-sm bg-gray-500 py-1 px-2 rounded-xl hover:bg-black mr-2"
              onClick={() => {
                setFiles(imageFiles);
                setShowImgList(false);
                setCurrentIdx(0);
              }}
            >
              순서 및 추가 사진 저장하기
            </button>
            <button
              className="mt-1 text-sm bg-gray-500 py-1 px-2 rounded-xl hover:bg-black"
              onClick={() => {
                setShowImgList(false);
              }}
            >
              취소
            </button>
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="image-list" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps} // DnD가 드래그 허용되도록 필요한 속성
                className="flex items-center overflow-x-auto  overflow-y-hidden h-[100px]" //overflow-y-hidden: 세로 스크롤은 안 생기게 막음
              >
                {imageFiles.map((file, index) => (
                  <Draggable
                    key={file.name}
                    draggableId={file.name}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style, // 드래그 중 위치 이동 스타일 (transform: translate 등 포함)
                          position: "static", // 엉뚱한 위치로 튀는 경우 방지
                        }}
                      >
                        <div className="relative w-[130px] h-[100px] px-1 ">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-full cursor-default"
                            draggable={false}
                          />
                          <button
                            className="absolute top-1 right-1 bg-black/60 text-white rounded-full text-[9px] px-1.5 py-1 hover:bg-red-500 transition"
                            onClick={() => handleDelete(file)}
                          >
                            ❌
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}

                <Button
                  className="py-7"
                  variant="custom"
                  onClick={() => fileInputRef.current?.click()}
                >
                  추가
                </Button>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
}
