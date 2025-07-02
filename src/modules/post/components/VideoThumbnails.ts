export async function VideoThumbnails(
  videoElement: HTMLVideoElement
): Promise<string[]> {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const thumbnails: string[] = [];

  if (!context) return [];

  const duration = videoElement.duration;
  const width = 160;
  const height = (videoElement.videoHeight / videoElement.videoWidth) * width;
  canvas.width = width;
  canvas.height = height;

  for (let time = 0; time < duration; time += 5) {
    await new Promise<void>((resolve) => {
      videoElement.currentTime = time;
      videoElement.onseeked = () => {
        context.drawImage(videoElement, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        thumbnails.push(dataUrl);
        resolve();
      };
    });
  }

  return thumbnails;
}
