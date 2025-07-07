import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");
  const limit = Number(searchParams.get("limit") || 10);

  try {
    const posts = await prisma.post.findMany({
      orderBy: { id: "desc" },
      take: limit,
      cursor: cursor ? { id: Number(cursor) } : undefined,
      skip: cursor ? 1 : 0,
      include: {
        user: true,
        postTags: {
          include: {
            tag: true,
          },
        },
        medias: true,
        likes: true,
        comments: true,
      },
    });
    const nextCursor = posts.length > 0 ? posts[posts.length - 1].id : null;
    return NextResponse.json({ posts: posts, nextCursor: nextCursor });
  } catch (err) {
    console.error("Post List 조회 실패 :", err);
    return NextResponse.json({ error: "Post List 조회 실패" }, { status: 500 });
  }
}
