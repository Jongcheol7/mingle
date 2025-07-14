"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisIcon } from "lucide-react";
import Image from "next/image";

type Post = {
  post: {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    postId: number;
    user: {
      username: string;
      imageUrl: string;
    };
  };
};

const formatDate = (date: string) => {
  const formatDate = new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return formatDate;
};

export default function PostHeader({ post }: Post) {
  //const [showToggle, setShowToggle] = useState(false);
  return (
    <div className="flex items-center w-full justify-between px-3 mb-2">
      <div className="flex items-center">
        <Image
          src={post.user.imageUrl}
          alt="profileImage"
          width={30}
          height={30}
          priority
          className="rounded-full mr-1"
        />
        <span>{post.user.username}</span>
        <span className="text-[11px] tracking-tight ml-2 mt-1">
          {formatDate(post.createdAt)}
        </span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisIcon
            className="mt-1 cursor-pointer"
            //onClick={() => setShowToggle(!showToggle)}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>친구추가</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>메세지</DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
