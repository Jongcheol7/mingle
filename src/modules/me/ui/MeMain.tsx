import MePostList from "./MePostList";
import MeProfile from "./MeProfile";

export default function MeMain() {
  return (
    <div className="mt-8 flex flex-col  gap-10">
      <MeProfile />
      <MePostList />
    </div>
  );
}
