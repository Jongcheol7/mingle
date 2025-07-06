import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import PostCommentLists from "./PostCommentLists";

type Post = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  medias: [
    {
      id: number;
      postId: number;
      type: string;
      url: string;
    }
  ];
  author: {
    username: string;
    imageUrl: string;
  };
};

type Props = {
  setIsShowDetail: (value: boolean) => void;
  clickData: Post;
};

export default function MePostDetail({ setIsShowDetail, clickData }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  return (
    <div>
      {/* 배경 블러처리 */}
      <div
        className="fixed inset-0 z-20 bg-black/60 backdrop-blur-xs"
        onClick={() => setIsShowDetail(false)}
      />

      {/* 메인 팝업 */}
      <Card className="fixed w-[70vw] h-[90vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 overflow-hidden p-0">
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
            ></Textarea>
            <div className="flex gap-2 ml-3">
              <div className="flex items-center ">
                <Heart className="w-4 cursor-pointer hover:text-rose-500 transition" />
                <p className="text-[12px] text-gray-800">1만개</p>
              </div>
              <div className="flex items-center ">
                <MessageCircle className="w-4 cursor-pointer hover:text-blue-500 transition" />
                <p className="text-[12px] text-gray-800">27개</p>
              </div>
              <div className="flex items-center ">
                <Share2 className="w-4 cursor-pointer hover:text-emerald-500 transition" />
                <p className="text-[12px] text-gray-800">300개</p>
              </div>
            </div>
            <PostCommentLists />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
