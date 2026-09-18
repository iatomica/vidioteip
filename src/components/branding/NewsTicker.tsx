import React from "react";
import { useCurrentFrame } from "remotion";
import { ThemeTokens, ThemeName, getTheme } from "../../lib/config/themes";

export interface NewsTickerProps {
  items: string[];
  theme?: ThemeTokens | ThemeName;
  speed?: number; // pixels per frame
  position?: "bottom" | "top";
  label?: string;
}

export function NewsTicker({
  items,
  theme: themeProp = "news-modern",
  speed = 3.5,
  position = "bottom",
  label,
}: NewsTickerProps) {
  const frame = useCurrentFrame();
  const theme = typeof themeProp === "string" ? getTheme(themeProp) : (themeProp ?? getTheme());

  if (!items || items.length === 0) return null;

  // Seamless repetition
  const tickerText = items.join("   •••   ") + "   •••   ";
  const offset = (frame * speed) % 2000;

  return (
    <div
      style={{
        position: "absolute",
        bottom: position === "bottom" ? 0 : undefined,
        top: position === "top" ? 0 : undefined,
        left: 0,
        right: 0,
        height: 48,
        backgroundColor: theme.tickerBackground,
        color: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        zIndex: 100,
        boxShadow: "0 -4px 15px rgba(0,0,0,0.3)",
      }}
    >
      {/* Live / Breaking Badge (only if label is passed) */}
      {label && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            backgroundColor: theme.badgeBackground,
            height: "100%",
            padding: "0 18px",
            fontWeight: 900,
            fontFamily: theme.fontFamily,
            fontSize: 13,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            zIndex: 2,
            boxShadow: "4px 0 10px rgba(0,0,0,0.2)",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#FFFFFF",
            }}
          />
          {label}
        </div>
      )}

      {/* Marquee track */}
      <div
        style={{
          display: "flex",
          whiteSpace: "nowrap",
          transform: `translateX(-${offset}px)`,
          fontFamily: theme.fontFamily,
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          paddingLeft: 20,
        }}
      >
        <span>{tickerText}</span>
        <span>{tickerText}</span>
      </div>
    </div>
  );
}
