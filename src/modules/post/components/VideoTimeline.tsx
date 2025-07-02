"use client";

import Image from "next/image";
import { useRef, useState } from "react";

interface TimelineProps {
  duration: number; // 전체 비디오 길이 (초)
  thumbnails: string[]; // 썸네일 이미지 배열
  onRangeSelect: (start: number, end: number) => void;
}

export default function VideoTimeline({
  duration,
  thumbnails,
  onRangeSelect,
}: TimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [startPercent, setStartPercent] = useState(0);
  const [endPercent, setEndPercent] = useState(95);
  const [previewImage, setPreviewImage] = useState<string | null>("");

  const handleMouseDown = (handle: "start" | "end") => () => {
    const onMouseMove = (e: MouseEvent) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      let percent = (x / rect.width) * 100;
      percent = Math.max(0, Math.min(100, percent));

      const currentTime = (percent / 100) * duration;
      const index = Math.floor(currentTime / 5);
      const previewImage = thumbnails[index] ?? "";
      console.log("previewImage :", previewImage);
      setPreviewImage(previewImage);

      if (handle === "start" && percent < endPercent) {
        setStartPercent(percent);
        onRangeSelect(
          (percent / 100) * duration,
          (endPercent / 100) * duration
        );
      } else if (handle === "end" && percent > startPercent) {
        setEndPercent(percent);
        onRangeSelect(
          (startPercent / 100) * duration,
          (percent / 100) * duration
        );
      }
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      setPreviewImage("");
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="w-full py-4 flex flex-col overflow-hidden">
      {/* 썸네일 타임라인 */}
      <div className="flex flex-col">
        <div
          ref={trackRef}
          className="relative h-20 rounded overflow-hidden border border-gray-300"
        >
          <div className="flex h-full w-full">
            {thumbnails.map((thumb, idx) => (
              <Image
                key={idx}
                src={thumb}
                alt={`thumbnail-${idx}`}
                className="h-full object-cover"
                width={100}
                height={100}
                style={{ width: `${100 / thumbnails.length}%` }}
              />
            ))}
          </div>

          {/* 선택된 범위 */}
          <div
            className="absolute top-0 h-full bg-blue-400 opacity-40"
            style={{
              left: `${startPercent}%`,
              width: `${endPercent - startPercent}%`,
            }}
          />

          {/* 시작 핸들 */}
          <div
            className="absolute top-0 w-2 h-full bg-blue-700 cursor-ew-resize"
            style={{ left: `${startPercent}%` }}
            onMouseDown={handleMouseDown("start")}
          ></div>

          {/* 끝 핸들 */}
          <div
            className="absolute top-0 w-2 h-full bg-blue-700 cursor-ew-resize"
            style={{ left: `${endPercent}%` }}
            onMouseDown={handleMouseDown("end")}
          ></div>
        </div>

        <div className="text-sm text-center mt-2 text-gray-600">
          {Math.floor(((startPercent / 100) * duration) / 60)}분
          {Math.floor(((startPercent / 100) * duration) % 60)}초 ~{" "}
          {Math.floor(((endPercent / 100) * duration) / 60)}분
          {Math.floor(((endPercent / 100) * duration) % 60)}초
          {` (구간:${Math.floor(
            ((endPercent / 100) * duration - (startPercent / 100) * duration) /
              60
          )}분${Math.floor(
            ((endPercent / 100) * duration - (startPercent / 100) * duration) %
              60
          )}초)`}
        </div>
      </div>

      <div className="flex justify-center">
        {previewImage && (
          <Image src={previewImage} width={100} height={100} alt="test" />
        )}
      </div>
    </div>
  );
}
