import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PostCommentLists from "@/modules/me/ui/PostCommentLists";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import PostButtons from "./PostButtons";
import CommentForm from "../components/CommentForm";
import { Post } from "@/types/post";

type Props = {
  setIsShowDetail: (value: boolean) => void;
  clickData: Post;
};

export default function PostDetail({ setIsShowDetail, clickData }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);

  console.log("ddd : ", clickData);

  return (
    <div>
      {/* 배경 블러처리 */}
      <div
        className="fixed inset-0 z-20 bg-black/60 backdrop-blur-xs"
        onClick={() => setIsShowDetail(false)}
      />

      {/* 메인 팝업 */}
      <Card className="fixed w-[70vw] h-[90vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 overflow-hidden rounded-none p-0">
        <CardContent className="flex h-full p-0">
          {/* 좌측 */}
          <div className="relative w-[60%] h-full">
            {currentIdx < clickData.medias.length - 1 && (
              <button
                className="absolute top-1/2 right-2 z-20"
                onClick={() => setCurrentIdx(currentIdx + 1)}
              >
                <ChevronRight />
              </button>
            )}
            {currentIdx > 0 && (
              <button
                className="absolute top-1/2 left-2 z-20"
                onClick={() => setCurrentIdx(currentIdx - 1)}
              >
                <ChevronLeft />
              </button>
            )}
            {clickData &&
              clickData.medias.length > 0 &&
              clickData.medias[currentIdx] && (
                <Image
                  src={clickData.medias[currentIdx].url}
                  fill
                  alt="사진"
                  className="object-cover"
                />
              )}
          </div>
          {/* 우측 */}
          <div className="relative w-[40%] h-full">
            <Input
              defaultValue={clickData.title}
              className="border-none focus-visible:ring-0 font-bold"
            />
            <Textarea
              value={clickData.content}
              readOnly
              className="border-none resize-none focus-visible:ring-0"
            />
            <PostButtons clickData={clickData} />
            <CommentForm postId={clickData.id} />
            <PostCommentLists postId={clickData.id} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
