import { Scene, TimelineSegment } from "../../compositions/NewsVideo/types";

interface DurationFallback {
  durationInFrames?: number;
  duration?: number;
}

/**
 * Automatically builds an ordered timeline of scenes, calculating absolute start
 * and end frames without magic numbers.
 */
export function buildTimeline(scenes: Scene[]): TimelineSegment[] {
  let currentFrame = 0;

  return scenes.map((scene) => {
    const duration =
      scene.durationInFrames ?? (scene as unknown as DurationFallback).duration ?? 120;
    const segment: TimelineSegment = {
      scene,
      startFrame: currentFrame,
      durationInFrames: duration,
      endFrame: currentFrame + duration,
    };
    currentFrame += duration;
    return segment;
  });
}

/**
 * Calculates total frames needed to render all concatenated scenes.
 */
export function calculateTotalDuration(scenes: Scene[]): number {
  if (!scenes || scenes.length === 0) return 30;
  return scenes.reduce((total, scene) => {
    const duration =
      scene.durationInFrames ?? (scene as unknown as DurationFallback).duration ?? 120;
    return total + duration;
  }, 0);
}

/**
 * Converts frame number to MM:SS:FF timecode string for debugging.
 */
export function formatTimecode(frame: number, fps: number = 30): string {
  const totalSeconds = Math.floor(frame / fps);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const frames = Math.floor(frame % fps);

  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  const ff = String(frames).padStart(2, "0");

  return `${mm}:${ss}:${ff}`;
}
