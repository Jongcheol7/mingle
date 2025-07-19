import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import HomeSidebar from "../components/Sidebar/HomeSidebar";
import RightSideMain from "../components/Sidebar/RightSideMain";

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
          <div className="flex gap-4 ml-4">
            {/* 중앙 콘텐츠 영역 */}
            <main className="flex-1">{children}</main>
            {/* 우측 사이드바 */}
            <RightSideMain />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
