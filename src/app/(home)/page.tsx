import UserInitializer from "@/modules/auth/common/UserInitializer";

export default async function Home() {
  return (
    <div>
      <UserInitializer />
      <p>홈페이지</p>
    </div>
  );
}
