import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { postId, content, parentId } = await request.json();
  console.log("Comment 저장시 postId : ", postId);
  console.log("Comment 저장시 content : ", content);

  if (!postId) {
    console.error("Comment  저장시 postId 를 찾을수 없습니다.");
    return NextResponse.json(
      { error: "Comment  저장시 postId 를 찾을수 없습니다." },
      { status: 400 }
    );
  }
  if (!content || content.trim() === "") {
    console.error("Comment  저장시 content 내용이 없습니다.");
    return NextResponse.json(
      { error: "Comment  저장시 content 내용이 없습니다." },
      { status: 400 }
    );
  }

  const { userId } = await auth();
  if (!userId) {
    console.error("댓글을 입력한 userId를 찾을수 없습니다.");
    return NextResponse.json(
      { error: "댓글을 입력한 userId를 찾을수 없습니다." },
      { status: 401 }
    );
  }

  try {
    await prisma.comment.create({
      data: {
        userId,
        postId,
        content: content.trim(),
        parentId: parentId || null,
      },
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Comment 저장에 실패했습니다 :", err);
    return NextResponse.json(
      { error: "Comment 저장에 실패했습니다" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = Number(searchParams.get("postId"));
  const cursor = searchParams.get("cursor");
  const limit = Number(searchParams.get("limit") || 10);

  if (!postId) {
    console.error("댓글 조회에서 postId 가 없습니다.");
    return NextResponse.json(
      { error: "댓글 조회에서 postId 가 없습니다." },
      { status: 400 }
    );
  }

  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId,
      },
      include: {
        likes: true,
        replies: true,
        user: true,
      },
      take: limit,
      cursor: cursor ? { id: Number(cursor) } : undefined,
      skip: cursor ? 1 : 0,
    });
    const nextCursor =
      comments.length > 0 ? comments[comments.length - 1].id : null;
    return NextResponse.json({ comments: comments, nextCursor: nextCursor });
  } catch (err) {
    console.error("댓글 조회에 실패했습니다.", err);
    return NextResponse.json(
      { error: "댓글 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}
