import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeIn, slideIn } from "../../lib/animation/primitives";
import { ThemeTokens, ThemeName, getTheme } from "../../lib/config/themes";

interface QuoteProps {
  quote: string;
  author: string;
  role?: string;
  theme?: ThemeTokens | ThemeName;
  delay?: number;
}

export function Quote({
  quote,
  author,
  role,
  theme: themeProp = "news-modern",
  delay = 5,
}: QuoteProps) {
  const frame = useCurrentFrame();
  const theme = typeof themeProp === "string" ? getTheme(themeProp) : (themeProp ?? getTheme());
  const opacity = fadeIn(frame, delay, 15);
  const translateY = slideIn(frame, "up", 30, delay, 20);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        padding: "36px 40px",
        backgroundColor: "rgba(30, 41, 59, 0.4)",
        backdropFilter: "blur(12px)",
        border: `1px solid ${theme.surfaceBorder}`,
        borderLeft: `6px solid ${theme.accent}`,
        borderRadius: theme.borderRadius.lg,
        boxShadow: theme.shadow,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {/* Decorative Quote Mark */}
      <span
        style={{
          position: "absolute",
          top: 10,
          right: 24,
          fontFamily: "serif",
          fontSize: 80,
          lineHeight: 1,
          color: theme.accent,
          opacity: 0.2,
          pointerEvents: "none",
        }}
      >
        “
      </span>

      {/* Quote text */}
      <p
        style={{
          fontFamily: theme.fontFamily,
          fontSize: 32,
          fontStyle: "italic",
          fontWeight: 500,
          lineHeight: 1.35,
          color: theme.foreground,
          margin: 0,
          zIndex: 1,
        }}
      >
        “{quote}”
      </p>

      {/* Author attribution */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, zIndex: 1 }}>
        <span
          style={{
            fontFamily: theme.headlineFont,
            fontSize: 20,
            fontWeight: 800,
            color: theme.accent,
            letterSpacing: "0.02em",
          }}
        >
          {author}
        </span>
        {role && (
          <span
            style={{
              fontFamily: theme.fontFamily,
              fontSize: 15,
              fontWeight: 500,
              color: theme.foregroundMuted,
            }}
          >
            {role}
          </span>
        )}
      </div>
    </div>
  );
}
