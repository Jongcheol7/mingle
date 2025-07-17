import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { senderId, receiverId, isDirect, roomName, message, roomId } =
    await request.json();

  if (!senderId) {
    console.error("보내는 사람 정보가 없습니다.");
    return NextResponse.json(
      { error: "보내는 사람 정보가 없습니다." },
      { status: 400 }
    );
  }
  if (!receiverId) {
    console.error("받는 사람 정보가 없습니다.");
    return NextResponse.json(
      { error: "받는 사람 정보가 없습니다." },
      { status: 400 }
    );
  }
  if (!message || message.trim() === "") {
    console.error("메세지가 없습니다.");
    return NextResponse.json(
      { error: "보내는 사람 정보가 없습니다." },
      { status: 400 }
    );
  }

  try {
    let finalRoomId = roomId;
    // 1. 방이 없다면 채팅방을 만들자.
    if (!roomId) {
      const newRoomId = await prisma.chatRoom.create({
        data: {
          isDirect,
          roomName,
          chatRoomMember: {
            create: [{ userId: senderId }, { userId: receiverId }],
          },
        },
      });
      finalRoomId = newRoomId.id;
    }

    // 2. 메세지 저장
    const messageSave = await prisma.message.create({
      data: {
        roomId: finalRoomId,
        senderId,
        message,
      },
      include: {
        sender: true,
      },
    });
    return NextResponse.json(messageSave);
  } catch (err) {
    console.error("메세지 저장시 오류가 발생했습니다.", err);
    return NextResponse.json(
      { error: "메세지 저장시 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
