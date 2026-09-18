import React from "react";
import { useCurrentFrame } from "remotion";
import { ThemeTokens, ThemeName, getTheme } from "../../lib/config/themes";

export interface BokehCirclesProps {
  theme?: ThemeTokens | ThemeName;
  count?: number;
}

export function BokehCircles({ theme: themeProp = "news-modern", count = 8 }: BokehCirclesProps) {
  const frame = useCurrentFrame();
  const theme = typeof themeProp === "string" ? getTheme(themeProp) : themeProp;

  const circles = Array.from({ length: count }, (_, i) => {
    const seed = i * 47.13;
    const baseLeft = (seed * 13) % 90;
    const baseTop = (seed * 17) % 90;
    const size = 120 + ((seed * 23) % 180);
    const speed = 0.3 + ((seed * 7) % 0.6);

    const translateY = Math.sin(frame * 0.03 * speed + seed) * 35;
    const opacity = 0.08 + Math.sin(frame * 0.04 * speed + seed) * 0.05;

    return {
      id: i,
      left: `${baseLeft}%`,
      top: `${baseTop}%`,
      size,
      translateY,
      opacity,
    };
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {circles.map((c) => (
        <div
          key={c.id}
          style={{
            position: "absolute",
            left: c.left,
            top: c.top,
            width: c.size,
            height: c.size,
            borderRadius: "50%",
            backgroundColor: theme.accent,
            filter: `blur(${c.size * 0.35}px)`,
            opacity: c.opacity,
            transform: `translateY(${c.translateY}px)`,
          }}
        />
      ))}
    </div>
  );
}
