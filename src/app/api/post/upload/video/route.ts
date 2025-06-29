import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function POST() {
  try {
    const upload = await mux.video.uploads.create({
      cors_origin: "http://localhost:3000",
      new_asset_settings: {
        playback_policy: ["public"],
      },
    });

    return NextResponse.json({ url: upload.url, id: upload.id });
  } catch (err) {
    console.error("Mux Upload Url 생성 오류 : ", err);
    return NextResponse.json(
      { error: "Mux Upload Url 생성 오류" },
      { status: 500 }
    );
  }
}
