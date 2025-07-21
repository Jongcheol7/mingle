import { Card } from "@/components/ui/card";
import PostDetail from "@/modules/post/ui/PostDetail";
import { Post } from "@/types/post";
import Image from "next/image";
import { useState } from "react";

type Props = {
  posts: {
    pages: {
      posts: Post[];
    }[];
  };
};

export default function SearchLists({ posts }: Props) {
  const [isShowDetail, setIsShowDetail] = useState(false);
  const [clickData, setClickData] = useState<Post>();
  console.log("posts", posts);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-4 gap-4 mx-auto">
      {posts &&
        posts.pages.map((page) =>
          page.posts.map((post: Post) => (
            <Card
              key={post.id}
              className="aspect-square w-full relative group overflow-hidden"
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
        <PostDetail setIsShowDetail={setIsShowDetail} clickData={clickData!} />
      )}
    </div>
  );
}
