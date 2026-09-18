import { useVideoConfig } from "remotion";

export type VideoFormat = "vertical" | "horizontal";

export interface VideoFormatConfig {
  format: VideoFormat;
  width: number;
  height: number;
  fps: number;
  aspectRatio: string;
}

export const VIDEO_FORMATS: Record<VideoFormat, VideoFormatConfig> = {
  vertical: {
    format: "vertical",
    width: 1080,
    height: 1920,
    fps: 30,
    aspectRatio: "9:16",
  },
  horizontal: {
    format: "horizontal",
    width: 1920,
    height: 1080,
    fps: 30,
    aspectRatio: "16:9",
  },
};

export const VERTICAL_VIDEO = VIDEO_FORMATS.vertical;
export const HORIZONTAL_VIDEO = VIDEO_FORMATS.horizontal;

/**
 * Hook to derive responsive layout variables from current Remotion video config.
 * Provides scaled margins, font multipliers, and safe areas based on aspect ratio.
 */
export function useResponsive() {
  const { width, height, fps, durationInFrames } = useVideoConfig();

  const isVertical = height > width;
  const isHorizontal = width >= height;
  const aspectRatio = width / height;

  // Base scale normalized to 1080p width
  const baseScale = isVertical ? width / 1080 : width / 1920;

  // Safe area offsets (pixels) for vertical social platforms (TikTok/Reels/Shorts)
  const safeArea = {
    top: isVertical ? Math.round(height * 0.12) : Math.round(height * 0.06), // ~230px on vertical
    bottom: isVertical ? Math.round(height * 0.16) : Math.round(height * 0.08), // ~300px on vertical
    left: isVertical ? Math.round(width * 0.06) : Math.round(width * 0.05),
    right: isVertical ? Math.round(width * 0.18) : Math.round(width * 0.05), // right edge has action buttons on TikTok
  };

  return {
    width,
    height,
    fps,
    durationInFrames,
    isVertical,
    isHorizontal,
    aspectRatio,
    baseScale,
    safeArea,
  };
}
