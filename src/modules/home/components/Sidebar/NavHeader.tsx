import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";

interface Props {
  items: {
    name: string;
    url: string;
    logo: string;
  };
}
export default function NavHeader({ items }: Props) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Link href={items.url} className="flex items-center gap-2 ml-1">
            <div className="text-sidebar-primary-foreground flex aspect-square size-7 items-center justify-center rounded-lg">
              <Image
                src={items.logo}
                priority
                alt="logo"
                width={60}
                height={60}
                className="object-contain"
              />
            </div>
            <div className="grid flex-1 text-left text-lg leading-tight">
              <span className="truncate font-bold">{items.name}</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
