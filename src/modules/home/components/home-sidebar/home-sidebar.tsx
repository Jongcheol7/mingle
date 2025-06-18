import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
import Link from "next/link";

const items = [
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
];

export default function HomeSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="ml-5 mt-10">
        <SidebarMenu className="flex gap-5">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                <Link href={item.url} className="flex items-center gap-4">
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <AuthButton />
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
