// /lib/ffmpeg/ffmpegClient.ts
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

//createFFmpeg: FFmpeg 인스턴스를 만드는 함수.
//fetchFile: 브라우저에서 File/Blob을 FFmpeg에서 읽을 수 있게 바꿔주는 도우미 함수.
// FFmpeg 인스턴스 생성 (lazy)
const ffmpeg = createFFmpeg({
  log: true, // 디버깅용 로그 출력
  corePath: "https://unpkg.com/@ffmpeg/core@0.12.6/dist/ffmpeg-core.js", // CDN 경로 (Next.js에서 필요)
});

export const ffmpegClient = {
  ffmpeg,
  isLoaded: false,

  // 초기화 함수
  async load() {
    if (!this.isLoaded) {
      await this.ffmpeg.load();
      this.isLoaded = true;
    }
  },

  fetchFile,
};
