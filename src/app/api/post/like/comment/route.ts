import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { commentId } = await request.json();

  if (!commentId) {
    console.error("댓글 좋아요 중 댓글 번호를 찾을수 없습니다.");
    return NextResponse.json(
      { error: "댓글 좋아요 중 댓글 번호를 찾을수 없습니다." },
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
    const alreadyLike = await prisma.commentLike.findUnique({
      where: { userId_commentId: { userId, commentId } },
    });
    if (alreadyLike) {
      await prisma.commentLike.delete({
        where: { userId_commentId: { userId, commentId } },
      });
      return NextResponse.json(
        { message: "좋아요 취소 성공", liked: false, commentId },
        { status: 200 }
      );
    } else {
      await prisma.commentLike.create({
        data: {
          userId: userId,
          commentId: commentId,
        },
      });
      return NextResponse.json(
        { message: "좋아요 추가 성공", liked: true, commentId },
        { status: 200 }
      );
    }
  } catch (err) {
    console.error("댓글 좋아요에 실패했습니다.", err);
    return NextResponse.json(
      { error: "댓글 좋아요에 실패했습니다" },
      { status: 500 }
    );
  }
}
