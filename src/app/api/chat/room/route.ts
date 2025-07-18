import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const senderId = searchParams.get("senderId");
  const receiverId = searchParams.get("receiverId");

  if (!senderId || !receiverId) {
    console.error("sender 혹은 receiver 정보가 없습니다.");
    return NextResponse.json(
      { error: "sender 혹은 receiver 정보가 없습니다." },
      { status: 400 }
    );
  }

  try {
    const roomId = await prisma.chatRoom.findFirst({
      where: {
        isDirect: true,
        AND: [
          { chatRoomMember: { some: { userId: senderId } } },
          { chatRoomMember: { some: { userId: receiverId } } },
        ],
      },
      select: {
        id: true,
      },
    });
    console.log("조회된 방 번호는 : ", roomId?.id);
    return NextResponse.json({ roomId: roomId?.id }, { status: 200 });
  } catch (err) {
    console.error("채팅방 번호 조회에 실패했습니다.", err);
    return NextResponse.json(
      { error: "채팅방 번호 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}
