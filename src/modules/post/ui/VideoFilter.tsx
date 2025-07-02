"use client";

import { useEffect, useRef, useState } from "react";
import { useUploadStore } from "@/lib/store/useUploadStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import VideoTimeline from "../components/VideoTimeline";
import { VideoThumbnails } from "../components/VideoThumbnails";

export default function VideoFilter() {
  const router = useRouter();
  const { saveFiles, setSaveFiles } = useUploadStore();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [range, setRange] = useState<{ start: number; end: number }>({
    start: 0,
    end: 0,
  });

  // 파일 URL 설정
  useEffect(() => {
    if (!saveFiles[0]) return;

    const url = URL.createObjectURL(saveFiles[0]);
    setVideoUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [saveFiles]);

  // duration, 썸네일 추출
  useEffect(() => {
    if (!videoRef.current) return;

    const handleMetadata = async () => {
      const video = videoRef.current!;
      setDuration(video.duration);

      const thumbs = await VideoThumbnails(video);
      setThumbnails(thumbs);
    };

    const video = videoRef.current;
    video.addEventListener("loadedmetadata", handleMetadata);

    return () => {
      video.removeEventListener("loadedmetadata", handleMetadata);
    };
  }, [videoUrl]);

  const handleTrimVideo = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const stream =
      video && "captureStream" in video
        ? (
            video as HTMLVideoElement & { captureStream: () => MediaStream }
          ).captureStream()
        : null;
    const recorder = new MediaRecorder(stream!);
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const file = new File([blob], "trimmed-video.webm", {
        type: "video/webm",
      });
      setSaveFiles([file]); // Zustand에 덮어쓰기
    };

    // 지정된 구간만 재생하면서 녹화 시작
    videoRef.current.currentTime = range.start;
    recorder.start();

    videoRef.current.play();

    const waitUntil = (time: number) =>
      new Promise<void>((resolve) => {
        const check = () => {
          if (!videoRef.current) return;
          if (videoRef.current.currentTime >= time) {
            videoRef.current.pause();
            resolve();
          } else {
            requestAnimationFrame(check);
          }
        };
        check();
      });

    await waitUntil(range.end);
    recorder.stop();
  };

  return (
    <div className="flex h-screen">
      <Card className="flex-1 gap-1 relative ml-5 mr-8 mt-8 px-1 h-[calc(100vh-70px)] flex flex-row shadow-xl">
        <div className="w-[60%] overflow-hidden flex items-center justify-center">
          {videoUrl && (
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              className="w-full h-full object-contain"
            />
          )}
        </div>

        {/* 오른쪽 타임라인 패널 */}
        <div className="w-[40%] flex flex-col">
          <div className="flex justify-end mb-4 gap-2">
            <Button variant={"outline"}>소리 제거</Button>
            <Button
              variant={"outline"}
              className="text-sm px-3 py-1"
              onClick={() => router.push("/post/new")}
            >
              이전
            </Button>
            <Button
              variant={"outline"}
              className="text-sm px-3 py-1"
              onClick={() => {
                handleTrimVideo();
                router.push("/post/new/video/write");
              }}
            >
              다음
            </Button>
          </div>

          <div className="px-2">
            {duration && thumbnails.length > 0 && (
              <VideoTimeline
                duration={duration}
                thumbnails={thumbnails}
                onRangeSelect={(start, end) => setRange({ start, end })}
              />
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
