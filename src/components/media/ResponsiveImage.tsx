import React from "react";
import { Img } from "remotion";
import { resolveAsset, generateSvgPlaceholder } from "../../lib/media/assets";

interface ResponsiveImageProps {
  src?: string;
  alt?: string;
  fit?: "cover" | "contain";
  position?: string;
  overlay?: boolean;
  overlayGradient?: string;
}

export function ResponsiveImage({
  src,
  alt = "News visual asset",
  fit = "cover",
  position = "center",
  overlay = true,
  overlayGradient = "linear-gradient(180deg, rgba(10,14,26,0.2) 0%, rgba(10,14,26,0.85) 100%)",
}: ResponsiveImageProps) {
  const resolvedSrc = src ? resolveAsset(src) : generateSvgPlaceholder(alt);

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
      <Img
        src={resolvedSrc}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: fit,
          objectPosition: position,
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
