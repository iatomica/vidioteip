import React from "react";
import { ThemeTokens, ThemeName, getTheme } from "../../lib/config/themes";

interface BrutalistFrameProps {
  theme?: ThemeTokens | ThemeName;
  issueCode?: string;
}

export function BrutalistFrame({
  theme: themeProp = "vox-editorial",
  issueCode = "VOL. 01 // DISPATCH",
}: BrutalistFrameProps) {
  const theme = typeof themeProp === "string" ? getTheme(themeProp) : (themeProp ?? getTheme());

  if (theme.name === "editorial-calm") {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      {/* Corner crosshairs */}
      <span
        style={{
          position: "absolute",
          top: 24,
          left: 24,
          fontFamily: "monospace",
          fontSize: 14,
          fontWeight: 700,
          color: theme.accent,
          opacity: 0.8,
        }}
      >
        +
      </span>

      <span
        style={{
          position: "absolute",
          top: 24,
          right: 24,
          fontFamily: "monospace",
          fontSize: 14,
          fontWeight: 700,
          color: theme.accent,
          opacity: 0.8,
        }}
      >
        +
      </span>

      <span
        style={{
          position: "absolute",
          bottom: 24,
          left: 24,
          fontFamily: "monospace",
          fontSize: 14,
          fontWeight: 700,
          color: theme.accent,
          opacity: 0.8,
        }}
      >
        +
      </span>

      <span
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          fontFamily: "monospace",
          fontSize: 14,
          fontWeight: 700,
          color: theme.accent,
          opacity: 0.8,
        }}
      >
        +
      </span>

      {/* Top right editorial volume stamp */}
      <div
        style={{
          position: "absolute",
          top: 26,
          right: 48,
          fontFamily: "monospace",
          fontSize: 10,
          letterSpacing: "0.18em",
          color: theme.foregroundMuted,
          opacity: 0.6,
          textTransform: "uppercase",
        }}
      >
        {issueCode}
      </div>
    </div>
  );
}
