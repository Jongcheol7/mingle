import { Button } from "@/components/ui/button";
import { UserProfile } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <Link href={"/"}>
        <Button variant={"custom"} className="mb-3">
          홈으로 이동
        </Button>
      </Link>
      <UserProfile />
    </div>
  );
}
