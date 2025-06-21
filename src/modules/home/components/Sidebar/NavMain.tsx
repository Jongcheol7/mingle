"use client";
import {
  SidebarGroup,
  //   SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
}
export default function NavMain({ items }: Props) {
  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}
      <SidebarMenu className="flex flex-col gap-5">
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              tooltip={item.title}
              className="group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:h-12"
            >
              <Link href={item.url} className="flex items-center gap-3 w-full">
                <item.icon className="w-6 h-7 shrink-0" />
                <span className="text-lg">{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
