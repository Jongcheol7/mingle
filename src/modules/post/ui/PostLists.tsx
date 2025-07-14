"use client";
import { Card } from "@/components/ui/card";
import { usePostLists } from "@/hooks/usePostLists";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import MuxPlayer from "@mux/mux-player-react";
import { useUploadStore } from "@/lib/store/useUploadStore";
import { useEffect, useState } from "react";
import { usePostLikeMutation } from "@/hooks/usePostLikeMutation";
import PostDetail from "./PostDetail";
import PostHeader from "./PostHeader";

type Post = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  postId: number;
  medias: [
    {
      id: number;
      postId: number;
      type: string;
      url: string;
    }
  ];
  user: {
    username: string;
    imageUrl: string;
  };
  likes: [
    {
      id: number;
      userId: string;
      postId: number;
    }
  ];
  comments: [
    {
      id: number;
      userId: string;
      postId: number;
      content: string;
      parentId: number;
    }
  ];
};

export default function PostLists() {
  const { data, error, isError } = usePostLists(); //refetch, isSuccess 생략
  const { clearFiles } = useUploadStore();
  const [isShowDetail, setIsShowDetail] = useState(false);
  const [clickData, setClickData] = useState<Post>();

  const {
    mutate: likeMutate,
    isPending: isLiking,
    isSuccess,
    data: likeResult,
  } = usePostLikeMutation();
  if (isSuccess) {
    console.log("data:: ", likeResult);
  }

  useEffect(() => {
    clearFiles();
  }, [clearFiles]);

  if (isError) {
    toast.error("Post 목록 조회 실패 : " + error);
  }

  console.log("data: ", data);
  return (
    <div className="flex flex-col items-center mr-4 overflow-y-auto h-[100vh] scrollbar-none">
      {data?.pages.map((page) =>
        page.posts.map((post: Post) => (
          <Card
            key={post.id}
            className="relative my-5 px-2 w-[600px]  flex flex-col items-center justify-between shadow-sm gap-4"
          >
            {/* 헤더 */}
            <PostHeader post={post} />

            {/* 메인 */}
            <div className="w-full flex flex-col items-start gap-2 px-2">
              <p className="text-sm text-gray-800 mb-2">{post.content}</p>
              {post.medias &&
              post.medias.length > 0 &&
              post.medias[0]?.type === "IMAGE" ? (
                post.medias.length === 1 ? (
                  <Image
                    src={post.medias[0].url}
                    //src={"logo.svg"}
                    alt="Post image"
                    width={400}
                    height={400}
                    className="w-full rounded-md object-cover"
                  />
                ) : (
                  <Swiper
                    spaceBetween={10}
                    slidesPerView={1}
                    className="w-full relative z-0  swiper-custom-nav"
                    navigation
                    modules={[Navigation]}
                  >
                    {post.medias.map((media) => (
                      <SwiperSlide key={media.id}>
                        <Image
                          src={media.url}
                          //src={"logo.svg"}
                          alt="Post image"
                          width={400}
                          height={400}
                          className="w-full rounded-md object-cover"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )
              ) : (
                //비디오일때
                <div className="w-full aspect-video overflow-hidden">
                  <MuxPlayer
                    playbackId={post.medias[0].url}
                    className="w-full h-full object-contain"
                    metadata={
                      {
                        // video_id: "video-id-123456",
                        // video_title: "Big Buck Bunny",
                        // viewer_user_id: "user-id-bc-789",
                      }
                    }
                  />
                </div>
              )}
            </div>

            {/* 푸터 */}
            <div className="flex gap-2">
              <div className="flex items-center ">
                <Heart
                  className={`cursor-pointer hover:text-rose-500 transition ${
                    isLiking ? "disabled" : ""
                  }`}
                  onClick={() => {
                    likeMutate(post.id);
                  }}
                />
                <p className="text-sm text-gray-800">
                  좋아요 {post.likes.length}개
                </p>
              </div>
              <div className="flex items-center ">
                <MessageCircle
                  className="cursor-pointer hover:text-blue-500 transition"
                  onClick={() => {
                    setIsShowDetail(!isShowDetail);
                    setClickData(post);
                  }}
                />
                <p className="text-sm text-gray-800">
                  댓글 {post.comments.length}개
                </p>
              </div>
              <div className="flex items-center ">
                <Share2 className="cursor-pointer hover:text-emerald-500 transition" />
                <p className="text-sm text-gray-800">공유 300개</p>
              </div>
            </div>
          </Card>
        ))
      )}
      {isShowDetail && (
        <PostDetail setIsShowDetail={setIsShowDetail} clickData={clickData!} />
      )}
    </div>
  );
}
