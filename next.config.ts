import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["img.clerk.com", process.env.CLOUDFRONT_DOMAIN as string], // ✅ 외부 이미지 허용 도메인
  },
};

export default nextConfig;
