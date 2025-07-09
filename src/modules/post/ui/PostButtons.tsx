import { Heart, MessageCircle, Share2 } from "lucide-react";

export default function PostButtons() {
  return (
    <div className="flex gap-2 ml-3 justify-center">
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
  );
}
