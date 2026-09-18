import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeIn, slideIn } from "../../lib/animation/primitives";
import { ThemeTokens, ThemeName, getTheme } from "../../lib/config/themes";

interface LowerThirdProps {
  primary: string;
  secondary?: string;
  theme?: ThemeTokens | ThemeName;
  delay?: number;
}

export function LowerThird({
  primary,
  secondary,
  theme: themeProp = "news-modern",
  delay = 5,
}: LowerThirdProps) {
  const frame = useCurrentFrame();
  const theme = typeof themeProp === "string" ? getTheme(themeProp) : (themeProp ?? getTheme());
  const opacity = fadeIn(frame, delay, 15);
  const translateY = slideIn(frame, "up", 25, delay, 18);

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        gap: 4,
        padding: "12px 20px",
        backgroundColor: "rgba(10, 14, 26, 0.85)",
        backdropFilter: "blur(12px)",
        borderLeft: `4px solid ${theme.accent}`,
        borderRadius: `0 ${theme.borderRadius.md} ${theme.borderRadius.md} 0`,
        boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <span
        style={{
          fontFamily: theme.headlineFont,
          fontSize: 22,
          fontWeight: 800,
          color: theme.foreground,
          letterSpacing: "-0.01em",
        }}
      >
        {primary}
      </span>
      {secondary && (
        <span
          style={{
            fontFamily: theme.fontFamily,
            fontSize: 14,
            fontWeight: 500,
            color: theme.foregroundMuted,
          }}
        >
          {secondary}
        </span>
      )}
    </div>
  );
}
