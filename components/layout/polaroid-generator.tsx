"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageIcon } from "lucide-react";
import { toPng } from "html-to-image";

import {
  Indie_Flower,
  Homemade_Apple,
  Caveat,
  Shadows_Into_Light,
  Kalam,
  Gloria_Hallelujah,
  Patrick_Hand,
  Architects_Daughter,
  Dancing_Script,
  Pacifico,
  Amatic_SC,
  Sacramento,
  Satisfy,
  Permanent_Marker,
  Rock_Salt,
  Covered_By_Your_Grace,
  Reenie_Beanie,
  Just_Another_Hand,
  Nothing_You_Could_Do,
  Waiting_for_the_Sunrise,
  Cedarville_Cursive,
  Loved_by_the_King,
  La_Belle_Aurore,
  Zeyada,
} from "next/font/google";
import { cn } from "@/lib/utils";
import { ImageColorGrading } from "@/components/editor/color-grading";
import Image from "next/image";
import TweaksAdjustments from "../editor/TweaksAdjustments";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import BlurredBackground from "../common/BlurredBackground";
import { tools, type ToolId } from "@/lib/tools";
import { presets, type Preset, type Adjustments } from "@/lib/presets";
import BottomNavigation from "../common/BottomNavigation";
import CameraCapture from "../common/CameraCapture";
// import StickerGallery from "../common/StickerGallery";
import { AnimatePresence, motion } from "framer-motion";
import Caption from "../common/Caption";
import CropTool from "../editor/CropTool";
import DraggableSticker from "../common/DraggableSticker";
import Link from "next/link";

// Initialize all fonts
const indieFlower = Indie_Flower({ weight: "400", subsets: ["latin"] });
const homemadeApple = Homemade_Apple({ weight: "400", subsets: ["latin"] });
const caveat = Caveat({ subsets: ["latin"] });
const shadowsIntoLight = Shadows_Into_Light({
  weight: "400",
  subsets: ["latin"],
});
const kalam = Kalam({ weight: "400", subsets: ["latin"] });
const gloriaHallelujah = Gloria_Hallelujah({
  weight: "400",
  subsets: ["latin"],
});
const patrickHand = Patrick_Hand({ weight: "400", subsets: ["latin"] });
const architectsDaughter = Architects_Daughter({
  weight: "400",
  subsets: ["latin"],
});
const dancingScript = Dancing_Script({ subsets: ["latin"] });
const pacifico = Pacifico({ weight: "400", subsets: ["latin"] });
const amaticSC = Amatic_SC({ weight: "400", subsets: ["latin"] });
const sacramento = Sacramento({ weight: "400", subsets: ["latin"] });
const satisfy = Satisfy({ weight: "400", subsets: ["latin"] });
const permanentMarker = Permanent_Marker({ weight: "400", subsets: ["latin"] });
const rockSalt = Rock_Salt({ weight: "400", subsets: ["latin"] });
const coveredByYourGrace = Covered_By_Your_Grace({
  weight: "400",
  subsets: ["latin"],
});
const reenieBeanie = Reenie_Beanie({ weight: "400", subsets: ["latin"] });
const justAnotherHand = Just_Another_Hand({
  weight: "400",
  subsets: ["latin"],
});
const nothingYouCouldDo = Nothing_You_Could_Do({
  weight: "400",
  subsets: ["latin"],
});
const waitingForTheSunrise = Waiting_for_the_Sunrise({
  weight: "400",
  subsets: ["latin"],
});
const cedarvilleCursive = Cedarville_Cursive({
  weight: "400",
  subsets: ["latin"],
});
const lovedByTheKing = Loved_by_the_King({ weight: "400", subsets: ["latin"] });
const laBelleAurore = La_Belle_Aurore({ weight: "400", subsets: ["latin"] });
const zeyada = Zeyada({ weight: "400", subsets: ["latin"] });

const fonts = {
  indieFlower,
  homemadeApple,
  caveat,
  shadowsIntoLight,
  kalam,
  gloriaHallelujah,
  patrickHand,
  architectsDaughter,
  dancingScript,
  pacifico,
  amaticSC,
  sacramento,
  satisfy,
  permanentMarker,
  rockSalt,
  coveredByYourGrace,
  reenieBeanie,
  justAnotherHand,
  nothingYouCouldDo,
  waitingForTheSunrise,
  cedarvilleCursive,
  lovedByTheKing,
  laBelleAurore,
  zeyada,
};

interface Sticker {
  id: string;
  url: string;
  name: string;
}

// New component for preset thumbnails
const PresetThumbnail: React.FC<{
  preset: Preset;
  image: string;
  isSelected: boolean;
  onClick: () => void;
}> = ({ preset, image, isSelected, onClick }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new (window.Image as { new (): HTMLImageElement })();
    img.crossOrigin = "anonymous";
    img.src = image;
    img.onload = function () {
      canvas.width = 100;
      canvas.height = 100;
      ctx.drawImage(img, 0, 0, 100, 100);

      const imageData = ctx.getImageData(0, 0, 100, 100);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        // Apply preset adjustments (simplified version)
        data[i] *= preset.adjustments.brightness; // Red
        data[i + 1] *= preset.adjustments.brightness; // Green
        data[i + 2] *= preset.adjustments.brightness; // Blue

        // Apply saturation
        const gray =
          0.2989 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] =
          gray * (1 - preset.adjustments.saturation) +
          data[i] * preset.adjustments.saturation;
        data[i + 1] =
          gray * (1 - preset.adjustments.saturation) +
          data[i + 1] * preset.adjustments.saturation;
        data[i + 2] =
          gray * (1 - preset.adjustments.saturation) +
          data[i + 2] * preset.adjustments.saturation;
      }

      ctx.putImageData(imageData, 0, 0);
      setPreviewImage(canvas.toDataURL());
    };
  }, [image, preset]);

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-full aspect-square rounded-lg overflow-hidden",
        "transition-all duration-300",
        isSelected ? "ring-2 ring-white" : "hover:ring-1 hover:ring-white/50"
      )}
    >
      {previewImage ? (
        <Image
          src={previewImage || "/placeholder.svg"}
          alt={preset.label}
          width={500}
          height={500}
          objectFit="cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-300 animate-pulse" />
      )}
      <div className="absolute inset-x-0 bottom-0 bg-black/50 p-1">
        <span className="text-xs text-white font-medium">{preset.label}</span>
      </div>
    </button>
  );
};

export default function PolaroidGenerator() {
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(presets[0]);
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const polaroidRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [adjustments, setAdjustments] = useState<Adjustments>(
    presets[0].adjustments
  );
  const [imageData, setImagedata] = useState<File | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [isPresetSelectionOpen, setIsPresetSelectionOpen] = useState(false);
  const presetMenuRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedFont, setSelectedFont] = useState("indieFlower");
  const [captionFontSize, setCaptionFontSize] = useState(24);
  const [isCropToolOpen, setIsCropToolOpen] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        setImage(result);
        setImagedata(file);
        setOriginalImage(result);
        setBackgroundImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  };

  const downloadImage = async () => {
    if (!polaroidRef.current || !processedImage) return;

    setLoading(true);
    try {
      const dataUrl = await toPng(polaroidRef.current, {
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download =
        `${imageData?.name}-polaroid-by-babyo7_.png` ||
        "polaroid-by-babyo7_.png";
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToolClick = (toolId: ToolId) => {
    if (toolId === "filters") {
      setIsPresetSelectionOpen((prev) => !prev);
      setActiveTool(null);
    }
    // else if (toolId === "crop") {
    //   setIsCropToolOpen(true);
    //   setActiveTool(null);
    // }
    else {
      setIsPresetSelectionOpen(false);
      setActiveTool(activeTool === toolId ? null : toolId);
    }
  };

  const handlePresetChange = (preset: Preset) => {
    setSelectedPreset(preset);
    setAdjustments(preset.adjustments);
  };

  const handleAdjustmentChange = (key: string, value: number) => {
    setAdjustments((prev) => ({ ...prev, [key]: value }));
  };

  const handleCameraCapture = (imageData: string) => {
    setImage(imageData);
    setBackgroundImage(imageData);
    setIsCameraOpen(false);
    // Reset to original preset when capturing new image
    setSelectedPreset(presets[0]);
    setAdjustments(presets[0].adjustments);
  };

  // const handleStickerSelect = (
  //   stickerUrl: string,
  //   stickerId: string,
  //   stickerName: string
  // ) => {
  //   setStickers((prev) => [
  //     ...prev,
  //     {
  //       id: `${stickerId}-${Date.now()}`,
  //       url: stickerUrl,
  //       name: stickerName,
  //     },
  //   ]);
  // };

  const handleStickerRemove = (stickerId: string) => {
    setStickers((prev) => prev.filter((sticker) => sticker.id !== stickerId));
  };

  const handleCroppedImage = (croppedImage: string) => {
    setImage(croppedImage);
    setBackgroundImage(croppedImage);
    setIsCropToolOpen(false);
  };

  const handleRevertImage = () => {
    if (originalImage) {
      setImage(originalImage);
      setBackgroundImage(originalImage);
    }
    setIsCropToolOpen(false);
  };

  useEffect(() => {
    if (image) {
      setProcessedImage(image);
    }
  }, [image]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        presetMenuRef.current &&
        !presetMenuRef.current.contains(event.target as Node)
      ) {
        setIsPresetSelectionOpen(false);
      }
    }

    if (isPresetSelectionOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPresetSelectionOpen]);

  const tweaksAdjustments = {
    brightness: {
      label: "Brightness",
      min: 0,
      max: 2,
      step: 0.01,
      value: adjustments.brightness,
    },
    contrast: {
      label: "Contrast",
      min: 0,
      max: 2,
      step: 0.01,
      value: adjustments.contrast,
    },
    saturation: {
      label: "Saturation",
      min: 0,
      max: 2,
      step: 0.01,
      value: adjustments.saturation,
    },
    hue: { label: "Hue", min: -180, max: 180, step: 1, value: adjustments.hue },
    noise: {
      label: "Noise",
      min: 0,
      max: 1,
      step: 0.01,
      value: adjustments.noise,
    },
    glare: {
      label: "Glare",
      min: 0,
      max: 1,
      step: 0.01,
      value: adjustments.glare,
    },
  };

  return (
    <div className="bg-gradient-to-b from-black via-black/95 to-black/90">
      {isCameraOpen && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setIsCameraOpen(false)}
        />
      )}

      <Link
        href={"https://tanmay.xyz"}
        className=" absolute top-3 left-3 text-gray-200 opacity-50 hover:underline underline-offset-4 hover:opacity-100 text-xs font-mono"
      >
        maded by cursor ai
      </Link>
      <div className="min-h-screen flex flex-col lg:flex-col lg:overflow-hidden lg:gap-8 lg:p-8">
        {backgroundImage && (
          <BlurredBackground
            image={backgroundImage}
            className="animate-fade-in opacity-60"
          />
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-auto  px-4 relative z-10 lg:flex lg:items-center lg:justify-center">
          <div className="max-w-md mx-auto space-y-6 lg:max-w-none lg:w-full lg:flex lg:items-center lg:justify-center lg:gap-16 lg:px-4">
            {/* Left side - Polaroid preview */}
            <div
              className={cn(
                "lg:flex-1 lg:flex lg:justify-end",
                image ? "lg:max-w-xl" : "lg:max-w-2xl"
              )}
            >
              {/* Header - Only show on mobile */}
              <div className="text-center space-y-0.5 mb-4 mt-12 lg:hidden">
                <h1 className="text-xl font-medium bg-gradient-to-r from-white/90 to-white/70 bg-clip-text text-transparent">
                  Polaroid
                </h1>
                <p className="text-xs text-white/50">
                  Create beautiful memories
                </p>
              </div>

              {!image ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={cn(
                    "h-[70vh] transition-all duration-500 ease-out",
                    "border-2 border-dashed rounded-3xl",
                    "flex items-center justify-center",
                    "bg-gradient-to-b from-white/[0.01] to-white/[0.01]",
                    "backdrop-blur-xl backdrop-saturate-150",
                    "lg:flex-1 lg:max-w-2xl lg:mx-auto",
                    isDragging
                      ? "border-purple-400/50 bg-purple-500/10 scale-[0.99]"
                      : "border-white/10 hover:border-white/20 hover:bg-white/[0.01]"
                  )}
                >
                  <div className="text-center space-y-4 p-6">
                    <div className="flex justify-center">
                      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                        <ImageIcon className="h-10 w-10 text-white/80" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-medium text-white/80">
                        Drag and drop your image here
                      </p>
                      {/* <p className="text-lg text-white/60">or</p> */}
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="mt-2 border-white/20 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
                        >
                          Choose Photo
                        </Button>
                      </div>
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Polaroid Image - Adjusted for desktop */}
                  <div
                    ref={polaroidRef}
                    className={cn(
                      "space-y-6 animate-fade-in lg:w-[400px] rounded-2xl overflow-hidden",
                      "transform transition-all duration-300",
                      "hover:scale-[1.01] hover:shadow-2xl bg-transparent"
                    )}
                  >
                    <div
                      className={cn("relative bg-white/90 backdrop-blur-xl")}
                      style={{
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      <div className="p-3">
                        <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
                          {image && (
                            <ImageColorGrading
                              image={image}
                              preset={selectedPreset.name}
                              adjustments={adjustments}
                              onProcessedImageChange={setProcessedImage}
                            />
                          )}
                          {processedImage && (
                            <Image
                              src={processedImage || "/placeholder.svg"}
                              alt="Processed image"
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="h-16 flex items-center justify-center mt-2 relative">
                          {caption && (
                            <p
                              className={cn(
                                "text-center whitespace-nowrap text-gray-800 leading-tight",
                                fonts[selectedFont as keyof typeof fonts]
                                  ?.className || fonts.indieFlower.className
                              )}
                              style={{ fontSize: `${captionFontSize}px` }}
                            >
                              {caption}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* Add stickers layer */}
                      <div className="absolute inset-3 rounded-xl overflow-hidden">
                        {stickers.map((sticker) => (
                          <DraggableSticker
                            key={sticker.id}
                            url={sticker.url}
                            name={sticker.name}
                            onRemove={() => handleStickerRemove(sticker.id)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {image && (
              /* Right side - Tools */
              <div className="lg:w-[400px]">
                {/* Tools Menu */}
                <div className="space-y-4 lg:p-6">
                  {/* Tools Bar */}
                  <AnimatePresence mode="wait">
                    {!isPresetSelectionOpen ? (
                      <motion.div
                        key="tools"
                        initial={{ borderRadius: 40 }}
                        animate={{ borderRadius: 16 }}
                        exit={{ borderRadius: 40, opacity: 0 }}
                        className="bg-gradient-to-b from-white/[0.12] to-white/[0.08] backdrop-blur-2xl p-3 border border-white/10"
                      >
                        <div className="flex justify-between items-center gap-2">
                          {tools.map((tool) => (
                            <Button
                              title={tool.label}
                              key={tool.id}
                              size="icon"
                              className={cn(
                                "rounded-xl flex-1 h-14  ",
                                "backdrop-blur-xl bg-white/10 transition-all duration-300",
                                "group relative overflow-hidden",
                                activeTool === tool.id
                                  ? "bg-white/20 text-white shadow-lg"
                                  : "text-white/60 hover:text-white hover:bg-white/10"
                              )}
                              onClick={() => handleToolClick(tool.id)}
                            >
                              <tool.icon
                                className={cn(
                                  "h-5 w-5 transition-transform duration-300",
                                  "group-hover:scale-110"
                                )}
                              />
                              <div
                                className={cn(
                                  "absolute inset-0 rounded-xl opacity-0 ",
                                  "bg-gradient-to-tr from-white/20 to-transparent",
                                  "transition-opacity duration-300",
                                  "group-hover:opacity-100"
                                )}
                              />
                            </Button>
                          ))}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        ref={presetMenuRef}
                        key="presets"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={cn(
                          "mt-3",
                          // Mobile styles
                          "bg-gradient-to-b from-white/[0.12] to-white/[0.08] backdrop-blur-2xl p-3 border border-white/10 rounded-[2rem]",
                          // Desktop styles
                          "lg:bg-white/[0.04] lg:backdrop-blur-xl lg:rounded-2xl lg:border-white/[0.03]"
                        )}
                      >
                        <div
                          ref={scrollContainerRef}
                          className={cn(
                            "relative",
                            // Mobile styles
                            "h-[120px] overflow-x-auto scrollbar-hide ",
                            // Desktop styles
                            "lg:h-[420px] lg:overflow-y-auto lg:overflow-x-hidden lg:px-2"
                          )}
                        >
                          <div
                            className={cn(
                              "py-2 px-1",
                              // Mobile: horizontal flex
                              "grid grid-flow-col auto-cols-[100px] gap-3",
                              // Desktop: grid layout
                              "lg:grid-flow-row lg:grid-cols-3 lg:auto-rows-[100px]"
                            )}
                          >
                            {presets.map((preset) => (
                              <PresetThumbnail
                                key={preset.name}
                                preset={preset}
                                image={image}
                                isSelected={selectedPreset.name === preset.name}
                                onClick={() => handlePresetChange(preset)}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Collapsible open={activeTool === "tweaks"}>
                    <CollapsibleContent className="bg-white/5 backdrop-blur-xl rounded-xl p-4 space-y-4">
                      <TweaksAdjustments
                        adjustments={tweaksAdjustments}
                        onChange={handleAdjustmentChange}
                      />
                    </CollapsibleContent>
                  </Collapsible>
                  {/* 
                  <Collapsible open={activeTool === "stickers"}>
                    <CollapsibleContent className="bg-white/5 backdrop-blur-xl rounded-xl p-4">
                      <StickerGallery
                        onSelect={(url, id, name) =>
                          handleStickerSelect(url, id, name)
                        }
                      />
                    </CollapsibleContent>
                  </Collapsible> */}

                  <Collapsible open={activeTool === "caption"}>
                    <CollapsibleContent className="bg-white/5 backdrop-blur-xl rounded-xl p-4">
                      <Caption
                        caption={caption}
                        isOpen={true}
                        onChange={setCaption}
                        selectedFont={selectedFont}
                        onFontChange={setSelectedFont}
                        fontSize={captionFontSize}
                        onFontSizeChange={setCaptionFontSize}
                      />
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            )}
          </div>
          {/* Bottom Navigation */}
          <BottomNavigation
            image={image}
            loading={loading}
            onDownload={downloadImage}
            onFileInputClick={() => fileInputRef.current?.click()}
            onCameraClick={() => setIsCameraOpen(true)}
            onReplace={processFile}
          />
        </div>

        {isCropToolOpen && image && (
          <CropTool
            image={image}
            onCropFinish={handleCroppedImage}
            onRevert={handleRevertImage}
            onClose={() => setIsCropToolOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
