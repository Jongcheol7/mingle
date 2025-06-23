"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import ImageList from "./ImageList";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  file: File[];
};

type FilterSetting = {
  brightness: number;
  saturation: number;
  contrast: number;
  blur: number;
  vignette: number;
  crop: { x: number; y: number };
  zoom: number;
  croppedAreaPixels: any;
};

const defaultSetting: FilterSetting = {
  brightness: 0,
  saturation: 0,
  contrast: 0,
  blur: 0,
  vignette: 0,
  crop: { x: 0, y: 0 },
  zoom: 1,
  croppedAreaPixels: null,
};

export default function ImageUpload({ file }: Props) {
  const [files, setFiles] = useState(file);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [showImgList, setShowImgList] = useState(false);

  // 슬라이더/크롭 관련 상태
  const [brightness, setBrightness] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [blur, setBlur] = useState(0);
  const [vignette, setVignette] = useState(0);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [filterSettings, setFilterSettings] = useState<FilterSetting[]>(
    file.map(() => ({ ...defaultSetting }))
  );

  // 이미지 URL 생성
  useEffect(() => {
    if (files.length > 0) {
      const url = URL.createObjectURL(files[currentIdx]);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [files, currentIdx]);

  // Crop 완료 시 위치 저장
  const onCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  // currentIdx가 바뀔 때 저장된 설정 불러오기
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

  // 현재 필터값 저장
  const saveCurrentSettings = () => {
    setFilterSettings((prev) => {
      const newArr = [...prev];
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
      return newArr;
    });
  };

  // 필터 CSS 적용
  const getFilterValue = () => {
    const safeBrightness = brightness / 100 + 1;
    const safeSaturation = saturation / 100 + 1;
    const safeContrast = contrast / 100 + 1;
    const safeBlur = Math.max(0, blur / 10);
    return `
      brightness(${safeBrightness})
      saturate(${safeSaturation})
      contrast(${safeContrast})
      blur(${safeBlur}px)
    `;
  };

  return (
    <div className="flex h-screen min-h-screen">
      <Card className="flex-1 relative ml-5 mr-8 mt-8 px-1 h-[calc(100vh-70px)] flex flex-row shadow-xl">
        {/* 왼쪽 Crop 영역 */}
        <div
          className="relative w-[60%] bg-black"
          style={{ filter: getFilterValue() }}
        >
          {files.length > 1 && (
            <p className="absolute left-2 top-2 z-10 font-semibold text-red-200 tracking-tight">
              {currentIdx + 1} / {files.length}
            </p>
          )}
          {files.length > 1 && currentIdx !== files.length - 1 && (
            <button
              className="absolute right-2 top-[45%] text-white z-10 bg-black/50 hover:bg-black p-2 rounded-full"
              onClick={() => {
                saveCurrentSettings();
                setCurrentIdx((currentIdx + 1) % files.length);
              }}
            >
              <ChevronRight />
            </button>
          )}
          {files.length > 1 && currentIdx !== 0 && (
            <button
              className="absolute left-2 top-[45%] text-white z-10 bg-black/50 hover:bg-black p-2 rounded-full"
              onClick={() => {
                saveCurrentSettings();
                setCurrentIdx((currentIdx - 1 + files.length) % files.length);
              }}
            >
              <ChevronLeft />
            </button>
          )}
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={1 / 1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
          <div className="absolute inset-0 pointer-events-none z-10">
            <div
              style={{
                background: `radial-gradient(circle, rgba(0,0,0,0) 50%, rgba(0,0,0,${
                  vignette / 100
                }) 100%)`,
                width: "100%",
                height: "100%",
              }}
            />
          </div>
          <Button
            variant={"secondary"}
            className="absolute bottom-5 right-5 rounded-full text-2xl px-3"
            onClick={() => setShowImgList(!showImgList)}
          >
            +
          </Button>
          {showImgList && (
            <ImageList
              files={files}
              setShowImgList={setShowImgList}
              setFiles={setFiles}
            />
          )}
        </div>

        {/* 오른쪽 슬라이더 영역 */}
        <div className="w-[40%] p-6 bg-white overflow-y-auto">
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
            { label: "흐리게", val: blur, set: setBlur, min: -100, max: 100 },
            {
              label: "주변 어둡게",
              val: vignette,
              set: setVignette,
              min: 0,
              max: 100,
            },
          ].map(({ label, val, set, min, max }, idx) => (
            <div className="mb-5 px-4" key={idx}>
              <div className="flex justify-between">
                <label className="text-sm font-semibold">{label}</label>
                <label
                  className="text-[11px] font-semibold text-pink-500 hover:text-pink-400 cursor-pointer"
                  onClick={() => set(0)}
                >
                  초기값
                </label>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <Slider
                  min={min}
                  max={max}
                  step={1}
                  value={[val]}
                  onValueChange={([val]) => set(val)}
                  disabled={showImgList}
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
