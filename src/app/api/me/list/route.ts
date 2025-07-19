import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");
  const limit = Number(searchParams.get("limit") || 10);

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "No userId in Clerk Session" },
      { status: 401 }
    );
  }

  try {
    const posts = await prisma.post.findMany({
      where: {
        userId,
      },
      orderBy: { id: "desc" },
      take: limit,
      cursor: cursor ? { id: Number(cursor) } : undefined,
      skip: cursor ? 1 : 0,
      include: {
        medias: true,
        user: true,
        postTags: {
          include: {
            tag: true,
          },
        },
        likes: true,
        comments: true,
      },
    });
    const nextCursor = posts.length > 0 ? posts[posts.length - 1].id : null;
    return NextResponse.json({ posts: posts, nextCursor: nextCursor });
  } catch (err) {
    console.error("프로필 List 조회 실패 :", err);
    return NextResponse.json(
      { error: "프로필 List 조회 실패" },
      { status: 500 }
    );
  }
}
