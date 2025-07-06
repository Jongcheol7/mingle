import MePostLists from "./MePostLists";
import MeProfile from "./MeProfile";

export default function MeMain() {
  return (
    <div className="mt-8 flex flex-col  gap-10">
      <MeProfile />
      <MePostLists />
    </div>
  );
}
