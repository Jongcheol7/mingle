import { SidebarProvider } from "@/components/ui/sidebar";
import HomeSidebar from "../components/home-sidebar/home-sidebar";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div>
      <SidebarProvider>
        <div className="flex">
          <HomeSidebar />
          <main className="flex-1">
            {/* <SidebarTrigger /> */}
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
