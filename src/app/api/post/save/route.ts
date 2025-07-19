import { prisma } from "@/lib/prisma";
import { DeleteObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const Bucket = process.env.AWS_BUCKET_NAME;
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export async function POST(request: Request) {
  const { title, content, tags, imageUrls, assetId, playbackId } =
    (await request.json()) as {
      title: string;
      content: string;
      tags: string[];
      imageUrls: string[];
      assetId: string;
      playbackId: string;
    };

  console.log("title : ", title);
  console.log("content : ", content);
  console.log("tags : ", tags);
  console.log("imageUrls : ", imageUrls);
  console.log("assetId : ", assetId);
  console.log("playbackId : ", playbackId);

  if (!title || title.trim().length === 0) {
    console.error("글 제목이 없습니다.");
    return NextResponse.json({ error: "글 제목이 없습니다." }, { status: 400 });
  }
  if (!content || content.trim().length === 0) {
    console.error("글 내용이 없습니다.");
    return NextResponse.json({ error: "글 내용이 없습니다." }, { status: 400 });
  }
  if ((!imageUrls || imageUrls.length === 0) && (!assetId || !playbackId)) {
    console.error("이미지나 동영상이 없습니다.");
    return NextResponse.json(
      { error: "이미지나 동영상이 없습니다." },
      { status: 400 }
    );
  }

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "로그인 정보가 없습니다." },
      { status: 401 }
    );
  }

  try {
    const post = await prisma.post.create({
      data: {
        userId: userId,
        title: title,
        content: content,
      },
    });

    // 태그 중복 제거
    const uniqueTags = [
      ...new Set(tags.map((tag: string) => tag.trim().toLowerCase())),
    ];

    // 기존에 존재하는 태그 조회
    const existingTags = await prisma.tag.findMany({
      where: { name: { in: uniqueTags } },
    });

    // 없는 태그만 추리자.
    const existingNames = existingTags.map((tag) => tag.name);
    const newTagNames = uniqueTags.filter(
      (name) => !existingNames.includes(name)
    );

    if (newTagNames.length > 0) {
      await prisma.tag.createMany({
        data: newTagNames.map((name) => ({ name })),
        skipDuplicates: true,
      });
    }

    // 전체 태그 목록 다시 조회해서 PostTag 연결
    const allTags = await prisma.tag.findMany({
      where: { name: { in: uniqueTags } },
    });

    await prisma.postTag.createMany({
      data: allTags.map((tag) => ({
        postId: post.id,
        tagId: tag.id,
      })),
      skipDuplicates: true,
    });

    // 이미지 URL 저장
    if (imageUrls && imageUrls.length > 0) {
      await prisma.postMedia.createMany({
        data: imageUrls.map((url, index) => ({
          url: url,
          postId: post.id,
          type: "IMAGE",
          order: index,
        })),
      });
    }
    // 비디오 저장
    else {
      await prisma.postMedia.create({
        data: {
          url: playbackId,
          postId: post.id,
          type: "VIDEO",
          assetId,
          order: 0,
        },
      });
    }

    return NextResponse.json(
      { message: "POST 저장 성공", postId: post.id },
      { status: 200 }
    );
  } catch (err) {
    console.error("POST 저장에 실패했습니다.", err);
    return NextResponse.json(
      { error: "POST 저장에 실패했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = Number(searchParams.get("postId"));
  console.log("포스트 삭제 파람 ddd : ", postId);

  if (!postId) {
    console.error("포스트 삭제할 postId가 없습니다.");
    return NextResponse.json(
      { error: "포스트 삭제할 postId가" },
      { status: 400 }
    );
  }

  try {
    // POST를 삭제하기 전에 S3에 있는 사진부터 삭제하자.
    const medias = await prisma.postMedia.findMany({
      where: { postId },
    });

    const objectToDelete = medias.map((media) => {
      return {
        Key: media.url.split("/").pop()!,
      };
    });

    if (objectToDelete.length > 0) {
      await s3.send(
        new DeleteObjectsCommand({
          Bucket,
          Delete: { Objects: objectToDelete },
        })
      );
    }

    await prisma.post.update({
      where: {
        id: postId,
      },
      data: { deletedAt: new Date() },
    });
    return NextResponse.json(
      { message: "삭제 성공", deletedId: postId },
      { status: 200 }
    );
  } catch (err) {
    console.error("POST 삭제에 실패했습니다.", err);
    return NextResponse.json(
      { error: "POST 삭제에 실패했습니다." },
      { status: 500 }
    );
  }
}
