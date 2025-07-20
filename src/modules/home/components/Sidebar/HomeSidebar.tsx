"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AuthButton from "@/modules/auth/ui/AuthButton";
import {
  AlignJustify,
  Bell,
  CircleUserRound,
  //HomeIcon,
  MessagesSquareIcon,
  PlusSquare,
  SearchIcon,
  Youtube,
} from "lucide-react";
import NavHeader from "./NavHeader";
import NavMain from "./NavMain";

const data = {
  user: {
    name: "",
    email: "",
    image: "",
  },

  navHeader: {
    name: "Ｍｉｎｇｌｅ",
    url: "/",
    logo: "/mingle_logo.png",
  },

  navMain: [
    // {
    //   title: "홈",
    //   url: "/",
    //   icon: HomeIcon,
    // },
    {
      title: "검색",
      url: "/search",
      icon: SearchIcon,
    },
    {
      title: "밍스",
      url: "/",
      icon: Youtube,
    },

    {
      title: "메세지",
      url: "/chat",
      icon: MessagesSquareIcon,
    },
    {
      title: "알림",
      url: "/",
      icon: Bell,
    },
    {
      title: "만들기",
      url: "/post/new",
      icon: PlusSquare,
    },
    {
      title: "프로필",
      url: "/me",
      icon: CircleUserRound,
    },
    {
      title: "더보기",
      url: "/",
      icon: AlignJustify,
    },
  ],
};

export default function HomeSidebar() {
  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader className="py-7 relative">
          <SidebarTrigger className="absolute top-0 right-0" />
          <NavHeader items={data.navHeader} />
        </SidebarHeader>
        <SidebarContent className="overflow-y-auto h-[100vh] scrollbar-none">
          <NavMain items={data.navMain} />
        </SidebarContent>
        <SidebarFooter>
          <AuthButton />
        </SidebarFooter>
        {/* <SidebarRail /> */}
      </Sidebar>
    </>
  );
}
