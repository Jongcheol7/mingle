import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { postId } = await request.json();
  console.log("좋아요 추가할 postId :", postId);

  if (!postId) {
    console.error("좋아요 추가할 postId가 없습니다.");
    return NextResponse.json(
      { error: "좋아요 추가할 postId가 없습니다." },
      { status: 400 }
    );
  }

  const { userId } = await auth();
  if (!userId) {
    console.error("좋아요 누른 userId를 찾을수 없습니다.");
    return NextResponse.json(
      { error: "좋아요 누른 userId를 찾을수 없습니다." },
      { status: 401 }
    );
  }

  try {
    //이미 해당 유저가 좋아요를 했는지 조회해서 했다면 취소시키자.
    const alreadyLike = await prisma.like.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });
    if (alreadyLike) {
      await prisma.like.delete({
        where: {
          userId_postId: { userId, postId },
        },
      });
      return NextResponse.json(
        { message: "좋아요 취소 성공", liked: false },
        { status: 200 }
      );
    } else {
      await prisma.like.create({
        data: {
          userId: userId,
          postId: postId,
        },
      });
      return NextResponse.json(
        { message: "좋아요 추가 성공", liked: true, postId },
        { status: 200 }
      );
    }
  } catch (err) {
    console.error("좋아요 추가에 실패했습니다 : ", err);
    return NextResponse.json(
      { error: "좋아요 추가에 실패했습니다" },
      { status: 500 }
    );
  }
}
