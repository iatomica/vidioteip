import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeIn, slideIn } from "../../lib/animation/primitives";
import { ThemeTokens, ThemeName, getTheme } from "../../lib/config/themes";

export interface HighlightedHeadlineProps {
  text: string;
  theme?: ThemeTokens | ThemeName;
  fontSize?: number;
  delay?: number;
  highlightWords?: string[];
  className?: string;
  style?: React.CSSProperties;
}

export function HighlightedHeadline({
  text,
  theme: themeProp = "editorial-calm",
  fontSize = 64,
  delay = 4,
  className = "",
  style = {},
}: HighlightedHeadlineProps) {
  const frame = useCurrentFrame();
  const theme = typeof themeProp === "string" ? getTheme(themeProp) : (themeProp ?? getTheme());
  const words = text.split(" ");
  const isVox = theme.name === "vox-editorial";

  return (
    <h1
      className={`leading-[1.08] tracking-tight ${className}`}
      style={{
        fontFamily: theme.headlineFont,
        fontSize,
        fontWeight: isVox ? 900 : 800,
        color: theme.foreground,
        display: "flex",
        flexWrap: "wrap",
        gap: "0.22em 0.28em",
        margin: 0,
        textShadow: "0 2px 25px rgba(0, 0, 0, 0.95)",
        ...style,
      }}
    >
      {words.map((word, idx) => {
        const wordDelay = delay + idx * 2.2;
        const opacity = fadeIn(frame, wordDelay, 12);
        const translateY = slideIn(frame, "up", isVox ? 16 : 8, wordDelay, 14);
        const isLastTwo = idx >= words.length - 2;

        const cleanText = word.replace(/\*/g, "");

        return (
          <span
            key={idx}
            style={{
              position: "relative",
              display: "inline-block",
              opacity,
              transform: `translate3d(0, ${translateY}px, 0)`,
              whiteSpace: "nowrap",
              color: isLastTwo ? theme.accent : "#FFFFFF",
              textShadow: isLastTwo
                ? "0 2px 20px rgba(214, 27, 31, 0.45), 0 2px 12px rgba(0, 0, 0, 0.9)"
                : "0 2px 25px rgba(0, 0, 0, 0.95)",
            }}
          >
            {cleanText}
          </span>
        );
      })}
    </h1>
  );
}
