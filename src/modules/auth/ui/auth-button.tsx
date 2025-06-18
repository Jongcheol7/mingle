import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { UserCircle } from "lucide-react";

export default function AuthButton() {
  return (
    <>
      <SignedIn>
        <div className="flex items-center ml-2 mt-[-5px]">
          <UserButton />
          <Button variant={"ghost"} className="font-semibold">
            프로필
          </Button>
        </div>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <div className="flex items-center ml-2 mt-[-5px]">
            <UserCircle />
            <Button variant={"ghost"} className="font-semibold">
              Sign In
            </Button>
          </div>
        </SignInButton>
      </SignedOut>
    </>
  );
}
