import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeIn, slideIn } from "../../lib/animation/primitives";
import { ThemeTokens, ThemeName, getTheme } from "../../lib/config/themes";

export interface KickerProps {
  text: string;
  theme?: ThemeTokens | ThemeName;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function Kicker({
  text,
  theme: themeProp = "news-modern",
  delay = 0,
  className = "",
  style = {},
}: KickerProps) {
  const frame = useCurrentFrame();
  const theme = typeof themeProp === "string" ? getTheme(themeProp) : themeProp;
  const opacity = fadeIn(frame, delay, 12);
  const translateX = slideIn(frame, "left", 20, delay, 14);

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        opacity,
        transform: `translateX(${translateX}px)`,
        ...style,
      }}
    >
      <span
        style={{
          width: 4,
          height: 18,
          backgroundColor: theme.accent,
          borderRadius: 2,
        }}
      />
      <span
        style={{
          fontFamily: theme.fontFamily,
          fontSize: 16,
          fontWeight: 800,
          color: theme.accent,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        {text}
      </span>
    </div>
  );
}
