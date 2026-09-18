import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeIn, slideIn } from "../../lib/animation/primitives";
import { ThemeTokens, ThemeName, getTheme } from "../../lib/config/themes";

export interface HeadlineProps {
  text: string;
  theme?: ThemeTokens | ThemeName;
  fontSize?: number;
  delay?: number;
  stagger?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Headline({
  text,
  theme: themeProp = "news-modern",
  fontSize,
  delay = 5,
  stagger = true,
  className = "",
  style = {},
}: HeadlineProps) {
  const frame = useCurrentFrame();
  const theme = typeof themeProp === "string" ? getTheme(themeProp) : themeProp;
  const words = text.split(" ");

  if (!stagger) {
    const opacity = fadeIn(frame, delay, 15);
    const translateY = slideIn(frame, "up", 30, delay, 18);

    return (
      <h1
        className={className}
        style={{
          fontFamily: theme.headlineFont,
          fontSize: fontSize ?? (className ? undefined : 64),
          fontWeight: 800,
          color: theme.foreground,
          lineHeight: 1.08,
          letterSpacing: "-0.02em",
          margin: 0,
          opacity,
          transform: `translateY(${translateY}px)`,
          ...style,
        }}
      >
        {text}
      </h1>
    );
  }

  return (
    <h1
      className={className}
      style={{
        fontFamily: theme.headlineFont,
        fontSize: fontSize ?? (className ? undefined : 64),
        fontWeight: 800,
        color: theme.foreground,
        lineHeight: 1.1,
        letterSpacing: "-0.02em",
        margin: 0,
        display: "flex",
        flexWrap: "wrap",
        gap: "0.28em",
        ...style,
      }}
    >
      {words.map((word, idx) => {
        const wordDelay = delay + idx * 3;
        const opacity = fadeIn(frame, wordDelay, 12);
        const translateY = slideIn(frame, "up", 24, wordDelay, 15);

        return (
          <span
            key={idx}
            style={{
              display: "inline-block",
              opacity,
              transform: `translateY(${translateY}px)`,
            }}
          >
            {word}
          </span>
        );
      })}
    </h1>
  );
}
