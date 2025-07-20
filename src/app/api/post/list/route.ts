import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");
  const limit = Number(searchParams.get("limit") || 10);
  const option = searchParams.get("option");
  const keyword = searchParams.get("keyword");

  // 동적으로 where 절 구현
  const where: Prisma.PostWhereInput = {
    deletedAt: null,
  };
  if (option && keyword) {
    const trimKeyword = keyword.trim();
    if (option === "title") {
      where.title = { contains: trimKeyword, mode: "insensitive" };
    } else if (option === "content") {
      where.content = { contains: trimKeyword, mode: "insensitive" };
    } else if (option === "user") {
      where.user = {
        username: { contains: trimKeyword, mode: "insensitive" },
      };
    } else if (option === "tag") {
      where.postTags = {
        some: {
          //some 을 쓰는 이유는 post 와 postTags 가 1:N 관계이기 때문
          tag: {
            name: { contains: trimKeyword, mode: "insensitive" },
          },
        },
      };
    }
  }

  try {
    const posts = await prisma.post.findMany({
      where,
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
