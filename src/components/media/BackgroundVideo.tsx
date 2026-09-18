import React from "react";
import { OffthreadVideo } from "remotion";
import { resolveAsset } from "../../lib/media/assets";

interface BackgroundVideoProps {
  src: string;
  muted?: boolean;
  playbackRate?: number;
  overlay?: boolean;
  overlayGradient?: string;
}

export function BackgroundVideo({
  src,
  muted = true,
  playbackRate = 1.0,
  overlay = true,
  overlayGradient = "linear-gradient(180deg, rgba(10,14,26,0.3) 0%, rgba(10,14,26,0.85) 100%)",
}: BackgroundVideoProps) {
  const resolvedSrc = resolveAsset(src);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <OffthreadVideo
        src={resolvedSrc}
        muted={muted}
        playbackRate={playbackRate}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {overlay && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: overlayGradient,
          }}
        />
      )}
    </div>
  );
}
