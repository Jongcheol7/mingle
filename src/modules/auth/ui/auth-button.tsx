import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { UserCircle } from "lucide-react";

export default function AuthButton() {
  return (
    <>
      <SidebarMenu className="flex flex-col gap-5">
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <SignedIn>
              <div className="flex items-center gap-2">
                <UserButton />
                <span className="font-semibold">프로필</span>
              </div>
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <div className="flex items-center gap-2">
                  <UserCircle />
                  <span className="font-semibold">Sign In</span>
                </div>
              </SignInButton>
            </SignedOut>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
