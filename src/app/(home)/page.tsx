import UserInitializer from "@/modules/auth/common/UserInitializer";
import PostLists from "@/modules/home/ui/PostLists";

export default async function Home() {
  return (
    <div>
      <UserInitializer />
      <PostLists />
    </div>
  );
}
