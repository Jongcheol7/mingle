import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    console.error("내가 포함한 채팅방 조회시 userId를 찾을수 없습니다.");
    return NextResponse.json(
      { error: "내가 포함한 채팅방 조회시 userId를 찾을수 없습니다." },
      { status: 401 }
    );
  }

  try {
    const roomLists = await prisma.chatRoom.findMany({
      where: {
        chatRoomMember: { some: { userId } },
      },
      include: {
        chatRoomMember: {
          include: {
            user: true,
          },
        },
        message: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });
    console.log("roomLists : ", roomLists);
    console.log("roomLists[0].message : ", roomLists[0].message);

    const sortedRoomLists = roomLists.sort((a, b) => {
      const aTime = a.message[0]?.createdAt;
      const bTime = b.message[0]?.createdAt;
      return bTime.getTime() - aTime.getTime();
    });

    return NextResponse.json({ roomLists: sortedRoomLists }, { status: 200 });
  } catch (err) {
    console.error("채팅방 조회에 실패했습니다 :", err);
    return NextResponse.json(
      { error: "채팅방 조회에 실패했습니다" },
      { status: 500 }
    );
  }
}
