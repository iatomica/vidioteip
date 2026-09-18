import React from "react";
import { useCurrentFrame } from "remotion";
import { ThemeTokens, ThemeName, getTheme } from "../../lib/config/themes";

interface GridPulseProps {
  theme?: ThemeTokens | ThemeName;
  gridSize?: number;
}

export function GridPulse({ theme: themeProp = "news-modern", gridSize = 60 }: GridPulseProps) {
  const frame = useCurrentFrame();
  const theme = typeof themeProp === "string" ? getTheme(themeProp) : (themeProp ?? getTheme());
  const pulse = 0.03 + Math.sin(frame * 0.05) * 0.02;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        backgroundImage: `linear-gradient(${theme.surfaceBorder} 1px, transparent 1px), linear-gradient(90deg, ${theme.surfaceBorder} 1px, transparent 1px)`,
        backgroundSize: `${gridSize}px ${gridSize}px`,
        opacity: pulse,
      }}
    />
  );
}
