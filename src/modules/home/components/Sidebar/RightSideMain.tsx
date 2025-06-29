export default function RightSideMain() {
  return (
    <aside className="w-[240px] mt-8 mr-4 sticky top-0 self-start">
      <div className="border rounded-lg p-4">
        <p className="text-sm font-semibold">추천 채널</p>
        <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
          <li>🌟 리액트 고수</li>
          <li>🔥 타입스크립트 핵심</li>
          <li>💼 개발자 취업정보</li>
        </ul>
      </div>
    </aside>
  );
}
