import React from "react";
import { ThemeTokens, ThemeName, getTheme } from "../../lib/config/themes";

interface GradientBackgroundProps {
  theme?: ThemeTokens | ThemeName;
  subtle?: boolean;
}

export function GradientBackground({
  theme: themeProp = "news-modern",
  subtle = false,
}: GradientBackgroundProps) {
  const theme = typeof themeProp === "string" ? getTheme(themeProp) : (themeProp ?? getTheme());
  const opacity = subtle ? 0.08 : 0.18;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: theme.background,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* Top primary glow */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "10%",
          width: "80%",
          height: "60%",
          background: `radial-gradient(ellipse at center, ${theme.accent} 0%, transparent 70%)`,
          opacity,
          filter: "blur(80px)",
        }}
      />

      {/* Bottom secondary accent */}
      <div
        style={{
          position: "absolute",
          bottom: "-15%",
          right: "-10%",
          width: "70%",
          height: "50%",
          background: `radial-gradient(ellipse at center, ${theme.danger} 0%, transparent 65%)`,
          opacity: opacity * 0.7,
          filter: "blur(90px)",
        }}
      />
    </div>
  );
}
