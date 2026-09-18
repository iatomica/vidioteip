import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeIn, slideIn } from "../../lib/animation/primitives";
import { ThemeTokens, ThemeName, getTheme } from "../../lib/config/themes";

interface SubheadlineProps {
  text: string;
  theme?: ThemeTokens | ThemeName;
  fontSize?: number;
  delay?: number;
}

export function Subheadline({
  text,
  theme: themeProp = "news-modern",
  fontSize = 28,
  delay = 12,
}: SubheadlineProps) {
  const frame = useCurrentFrame();
  const theme = typeof themeProp === "string" ? getTheme(themeProp) : (themeProp ?? getTheme());
  const opacity = fadeIn(frame, delay, 15);
  const translateY = slideIn(frame, "up", 20, delay, 18);

  return (
    <p
      style={{
        fontFamily: theme.fontFamily,
        fontSize,
        fontWeight: 600,
        color: "#F8FAFC",
        lineHeight: 1.35,
        margin: 0,
        opacity,
        transform: `translateY(${translateY}px)`,
        maxWidth: 920,
        textShadow: "0 2px 14px rgba(0, 0, 0, 0.8)",
      }}
    >
      {text}
    </p>
  );
}
