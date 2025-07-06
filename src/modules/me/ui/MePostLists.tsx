"use client";
import { Card } from "@/components/ui/card";
import { useMePostLists } from "@/hooks/useMePostLists";
import Image from "next/image";
import { useState } from "react";
import MePostDetail from "./MePostDetail";

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

export default function MePostLists() {
  const { data } = useMePostLists();
  const [isShowDetail, setIsShowDetail] = useState(false);
  const [clickData, setClickData] = useState<Post>();
  console.log("data", data);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-auto">
      {data &&
        data.pages.map((page) =>
          page.posts.map((post: Post) => (
            <Card
              key={post.id}
              className="w-60 h-60 relative group overflow-hidden"
            >
              {post.medias && post.medias.length > 0 && (
                <Image
                  src={
                    post.medias[0].type === "IMAGE"
                      ? post.medias[0].url
                      : `https://image.mux.com/${post.medias[0].url}/thumbnail.png`
                    //"logo.svg"
                  }
                  //src={"logo.svg"}
                  alt="Post image"
                  fill
                  className="object-cover group-hover:blur-md "
                />
              )}
              <div
                className="absolute p-2 inset-0 bg-black/50 opacity-0 group-hover:opacity-100 text-white flex flex-col cursor-pointer"
                onClick={() => {
                  setIsShowDetail(!isShowDetail);
                  setClickData(post);
                }}
              >
                <h3 className="text-lg font-bold">{post.title}</h3>
                <p className="text-sm line-clamp-5">{post.content}</p>
              </div>
            </Card>
          ))
        )}
      {isShowDetail && (
        <MePostDetail
          setIsShowDetail={setIsShowDetail}
          clickData={clickData!}
        />
      )}
    </div>
  );
}
