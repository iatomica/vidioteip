import React from "react";
import { Img, useCurrentFrame } from "remotion";
import { resolveAsset, generateSvgPlaceholder } from "../../lib/media/assets";
import { kenBurnsTransform } from "../../lib/animation/primitives";

interface KenBurnsImageProps {
  src?: string;
  alt?: string;
  durationInFrames: number;
  scaleFrom?: number;
  scaleTo?: number;
  xFrom?: number;
  xTo?: number;
  yFrom?: number;
  yTo?: number;
  overlay?: boolean;
  overlayGradient?: string;
}

export function KenBurnsImage({
  src,
  alt = "News photography",
  durationInFrames,
  scaleFrom = 1.0,
  scaleTo = 1.15,
  xFrom = 0,
  xTo = 0,
  yFrom = 0,
  yTo = 0,
  overlay = true,
  overlayGradient = "linear-gradient(180deg, rgba(10,14,26,0.1) 0%, rgba(10,14,26,0.85) 100%)",
}: KenBurnsImageProps) {
  const frame = useCurrentFrame();
  const resolvedSrc = src ? resolveAsset(src) : generateSvgPlaceholder(alt);

  const { transform } = kenBurnsTransform(frame, {
    duration: durationInFrames,
    scaleFrom,
    scaleTo,
    xFrom,
    xTo,
    yFrom,
    yTo,
  });

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
      <div
        style={{
          width: "100%",
          height: "100%",
          transform,
          transformOrigin: "center center",
          willChange: "transform",
        }}
      >
        <Img
          src={resolvedSrc}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

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
