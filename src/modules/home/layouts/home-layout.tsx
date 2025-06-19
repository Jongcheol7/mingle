import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import HomeSidebar from "../components/home-sidebar/home-sidebar";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div>
      <SidebarProvider>
        <HomeSidebar />
        {/* SidebarInset : 사이드바 옆의 메인 콘텐츠 영역을 감싸주는 wrapper 역할 */}
        <SidebarInset>
          <SidebarTrigger />
          <main className="flex-1">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
