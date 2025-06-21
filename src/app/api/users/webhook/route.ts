import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add CLERK_SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new NextResponse("Error: Verification error", {
      status: 400,
    });
  }

  // Do something with payload
  // For this guide, log payload to console
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { data } = evt;

    // 이미 존재한 유저인지 판단하자.
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: data.id },
    });
    if (!existingUser) {
      await prisma.user.create({
        data: {
          clerkId: data.id,
          name: `${data.first_name} ${data.last_name}`,
          email: data.email_addresses[0]?.email_address ?? "",
          username: data.username,
          imageUrl: data.image_url,
        },
      });
      console.log("✅ User Inserted in DB");
    } else {
      console.log("이미 존재하는 User 입니다.");
    }
  }

  if (eventType === "user.deleted") {
    const { data } = evt;

    // id가 있을때만 삭제하도록 안전장치
    if (!data.id) {
      console.error("Missing user ID");
      return new NextResponse("Missing user Id", { status: 400 });
    }

    await prisma.user.delete({
      where: { clerkId: data.id },
    });
    console.log("✅ User Deleted in DB");
  }

  if (eventType === "user.updated") {
    const { data } = evt;

    // id가 있을때만 삭제하도록 안전장치
    if (!data.id) {
      console.error("Missing user ID");
      return new NextResponse("Missing user Id", { status: 400 });
    }

    await prisma.user.update({
      where: { clerkId: data.id },
      data: {
        name: `${data.first_name} ${data.last_name}`,
        username: data.username,
        imageUrl: data.image_url,
      },
    });
    console.log("✅ User updated in DB");
  }

  return new NextResponse("Webhook received", { status: 200 });
}
