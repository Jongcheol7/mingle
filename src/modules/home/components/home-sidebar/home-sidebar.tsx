"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import AuthButton from "@/modules/auth/ui/auth-button";
import {
  AlignJustify,
  Bell,
  HomeIcon,
  MessagesSquareIcon,
  PlusSquare,
  SearchIcon,
  Youtube,
} from "lucide-react";
import NavHeader from "./nav-header";
import NavMain from "./nav-main";

const data = {
  user: {
    name: "",
    email: "",
    image: "",
  },

  navHeader: {
    name: "Mingle",
    url: "/",
    logo: "/logo.svg",
  },

  navMain: [
    {
      title: "홈",
      url: "/",
      icon: HomeIcon,
    },
    {
      title: "검색",
      url: "/",
      icon: SearchIcon,
    },
    {
      title: "밍스",
      url: "/",
      icon: Youtube,
    },

    {
      title: "메세지",
      url: "/",
      icon: MessagesSquareIcon,
    },
    {
      title: "알림",
      url: "/",
      icon: Bell,
    },
    {
      title: "만들기",
      url: "/",
      icon: PlusSquare,
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
        <SidebarHeader className="py-7">
          <NavHeader items={data.navHeader} />
        </SidebarHeader>
        <SidebarContent className="">
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
