import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "No userId in Clerk Session" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Can't find user info from DB" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    id: user.clerkId,
    name: user.name,
    username: user.username,
    email: user.email,
    imageUrl: user.imageUrl,
  });
}
