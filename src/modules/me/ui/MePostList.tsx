import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function MePostList() {
  const dummyPosts = [
    {
      id: "1",
      title: "제목1",
      content: "내용입니다~1",
      url: "logo.svg",
      type: "IMAGE",
    },
    {
      id: "2",
      title: "제목2",
      content: "내용입니다~2",
      url: "logo.svg",
      type: "IMAGE",
    },
    {
      id: "3",
      title: "제목3",
      content: "내용입니다~3",
      url: "logo.svg",
      type: "IMAGE",
    },
    {
      id: "4",
      title: "제목4",
      content: "내용입니다~4",
      url: "logo.svg",
      type: "IMAGE",
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-auto">
      {dummyPosts.map((post) => (
        <Card
          key={post.id}
          className="w-60 h-60 relative group overflow-hidden"
        >
          <Image
            src={post.url}
            fill
            className="object-cover group-hover:blur-md"
            alt="post.title"
          />
          <div className="absolute p-2 inset-0 bg-black/50 opacity-0 group-hover:opacity-100 text-white flex flex-col">
            <h3 className="text-lg font-bold">{post.title}</h3>
            <p className="text-sm line-clamp-5">{post.content}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
