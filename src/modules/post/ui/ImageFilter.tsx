"use client";

import { useEffect, useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useUploadImageStore } from "@/lib/store/useUploadImageStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type FilterSetting = {
  brightness: number;
  saturation: number;
  contrast: number;
  blur: number;
  vignette: number;
  crop: { x: number; y: number };
  zoom: number;
  croppedAreaPixels: Area | null;
};

export default function ImageFilter() {
  const router = useRouter();

  const { saveFiles, setSaveFiles } = useUploadImageStore(); // Zustand에서 불러오기
  const [currentIdx, setCurrentIdx] = useState(0); // 현재 보고있는 사진 index
  const [filterSettings, setFilterSettings] = useState<FilterSetting[]>(
    saveFiles.map(() => ({
      ...{
        brightness: 0,
        saturation: 0,
        contrast: 0,
        blur: 0,
        vignette: 0,
        crop: { x: 0, y: 0 },
        zoom: 1,
        croppedAreaPixels: null,
      },
    })) // 파일 수 만큼 초기값 생성
  );

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [brightness, setBrightness] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [blur, setBlur] = useState(0);
  const [vignette, setVignette] = useState(0);

  // 파일이 없으면 업로드 페이지로 되돌리기
  useEffect(() => {
    if (saveFiles.length === 0) {
      router.replace("/post/new");
    }
  }, [saveFiles, router]);

  // 현재 인덱스에 해당하는 필터 설정을 상태로 복원
  useEffect(() => {
    const setting = filterSettings[currentIdx];
    if (!setting) return;
    setBrightness(setting.brightness);
    setSaturation(setting.saturation);
    setContrast(setting.contrast);
    setBlur(setting.blur);
    setVignette(setting.vignette);
    setCrop(setting.crop);
    setZoom(setting.zoom);
    setCroppedAreaPixels(setting.croppedAreaPixels);
  }, [currentIdx, filterSettings]);

  // 현재 이미지의 필터 설정을 저장
  const saveCurrentSettings = (): FilterSetting[] => {
    const newArr = [...filterSettings];
    newArr[currentIdx] = {
      brightness,
      saturation,
      contrast,
      blur,
      vignette,
      crop,
      zoom,
      croppedAreaPixels,
    };
    setFilterSettings(newArr);
    return newArr;
  };

  // 크롭 완료 시 실행되는 콜백
  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  // CSS 필터 문자열 생성
  const getFilterValue = () => {
    const safeBrightness = brightness / 100 + 1;
    const safeSaturation = saturation / 100 + 1;
    const safeContrast = contrast / 100 + 1;
    const safeBlur = Math.max(0, blur / 10);

    return `brightness(${safeBrightness}) saturate(${safeSaturation}) contrast(${safeContrast}) blur(${safeBlur}px)`;
  };

  const getFilteredImageBlobForAll = async (
    settings: FilterSetting[]
  ): Promise<File[]> => {
    const result: File[] = [];
    for (let i = 0; i < saveFiles.length; i++) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = URL.createObjectURL(saveFiles[i]);

      await new Promise((res) => (img.onload = res));

      const setting = settings[i];
      console.log("setting : ", setting);
      const { x, y, width, height } = setting.croppedAreaPixels || {
        x: 0,
        y: 0,
        width: img.width,
        height: img.height,
      };

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) continue;

      canvas.width = width;
      canvas.height = height;

      // 필터 계산
      const safeBrightness = setting.brightness / 100 + 1;
      const safeSaturation = setting.saturation / 100 + 1;
      const safeContrast = setting.contrast / 100 + 1;
      const safeBlur = Math.max(0, setting.blur / 10);

      ctx.filter = `
      brightness(${safeBrightness})
      saturate(${safeSaturation})
      contrast(${safeContrast})
      blur(${safeBlur}px)
    `;

      // 이미지 크롭 영역만 그리기
      ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

      // Blob 생성 → File 변환
      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/jpeg", 0.95)
      );

      if (blob) {
        const file = new File([blob], `edited_${i + 1}.jpg`, {
          type: "image/jpeg",
        });
        result.push(file);
      }

      URL.revokeObjectURL(img.src); // 메모리 누수 방지
    }

    return result;
  };

  return (
    <div className="flex h-screen">
      <Card className="flex-1 relative ml-5 mr-8 mt-8 px-1 h-[calc(100vh-70px)] flex flex-row shadow-xl">
        {/* 왼쪽 이미지 영역 */}
        <div className="relative w-[60%] bg-black overflow-hidden">
          {saveFiles.length > 1 && (
            <p className="absolute left-2 top-2 z-10 font-semibold text-red-200">
              {currentIdx + 1} / {saveFiles.length}
            </p>
          )}

          {currentIdx < saveFiles.length - 1 && (
            <button
              className="absolute right-2 top-[45%] z-20 bg-black/50 hover:bg-black p-2 rounded-full text-white"
              onClick={() => {
                saveCurrentSettings();
                setCurrentIdx(currentIdx + 1);
              }}
            >
              <ChevronRight />
            </button>
          )}

          {currentIdx > 0 && (
            <button
              className="absolute left-2 top-[45%] z-20 bg-black/50 hover:bg-black p-2 rounded-full text-white"
              onClick={() => {
                saveCurrentSettings();
                setCurrentIdx(currentIdx - 1);
              }}
            >
              <ChevronLeft />
            </button>
          )}

          {/* 필터 적용은 이미지에만 */}
          <div className="relative w-full h-full">
            <Cropper
              image={URL.createObjectURL(saveFiles[currentIdx])}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              style={{
                mediaStyle: {
                  filter: getFilterValue(), // 여기만 필터 적용!
                },
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle, rgba(0,0,0,0) 50%, rgba(0,0,0,${
                  vignette / 100
                }) 100%)`,
              }}
            />
          </div>
        </div>

        {/* 오른쪽 슬라이더 조절 */}
        <div className="w-[40%] p-6 bg-white overflow-y-auto">
          <div className="flex justify-end mb-4 gap-2">
            <Button
              variant={"outline"}
              className="text-sm px-3 py-1  cursor-pointer"
              onClick={async () => {
                router.push("/post/new");
              }}
            >
              이전
            </Button>
            <Button
              variant={"outline"}
              className="text-sm px-3 py-1  cursor-pointer"
              onClick={async () => {
                const updatedSettings = saveCurrentSettings(); // 직접 업데이트 + 반환
                const savedFiles = await getFilteredImageBlobForAll(
                  updatedSettings
                ); // 그걸 기반으로 처리
                toast.success(
                  `총 ${savedFiles.length}개의 이미지가 저장되었습니다!`
                );
                setSaveFiles(savedFiles);
                router.push("/post/new/write");
              }}
            >
              다음
            </Button>
          </div>

          {[
            {
              label: "밝기",
              val: brightness,
              set: setBrightness,
              min: -100,
              max: 100,
            },
            {
              label: "채도",
              val: saturation,
              set: setSaturation,
              min: -100,
              max: 100,
            },
            {
              label: "대비",
              val: contrast,
              set: setContrast,
              min: -100,
              max: 100,
            },
            {
              label: "흐리게",
              val: blur,
              set: setBlur,
              min: 0,
              max: 100,
            },
            {
              label: "주변 어둡게",
              val: vignette,
              set: setVignette,
              min: 0,
              max: 100,
            },
          ].map(({ label, val, set, min, max }, idx) => (
            <div key={idx} className="mb-5 px-4">
              <div className="flex justify-between">
                <label className="text-sm font-semibold">{label}</label>
                <span
                  onClick={() => set(0)}
                  className="text-xs text-pink-500 hover:text-pink-400 cursor-pointer"
                >
                  초기값
                </span>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <Slider
                  min={min}
                  max={max}
                  step={1}
                  value={[val]}
                  onValueChange={([val]) => set(val)}
                />
                <span>{val}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
