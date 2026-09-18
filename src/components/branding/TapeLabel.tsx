import React from "react";
import { useCurrentFrame } from "remotion";
import { springScale } from "../../lib/animation/primitives";
import { ThemeTokens, ThemeName, getTheme } from "../../lib/config/themes";

interface TapeLabelProps {
  text: string;
  theme?: ThemeTokens | ThemeName;
  angle?: number;
  delay?: number;
  className?: string;
  variant?: "lime" | "danger" | "dark";
  fontSize?: number;
}

export function TapeLabel({
  text,
  theme: themeProp = "editorial-calm",
  angle = -2,
  delay = 2,
  className = "",
  variant = "lime",
  fontSize: fontSizeProp,
}: TapeLabelProps) {
  const frame = useCurrentFrame();
  const theme = typeof themeProp === "string" ? getTheme(themeProp) : (themeProp ?? getTheme());
  const isVox = theme.name === "vox-editorial";
  const scale = springScale(frame, { delay, damping: 12, stiffness: 120 });

  let bgColor = theme.accent;
  let textColor = isVox ? "#000000" : "#FFFFFF";

  if (variant === "danger") {
    bgColor = theme.danger;
    textColor = "#FFFFFF";
  } else if (variant === "dark") {
    bgColor = theme.surface;
    textColor = theme.foreground;
  }

  const fontSize = fontSizeProp ?? (isVox ? 13 : 18);

  return (
    <div
      className={`inline-flex items-center select-none font-mono ${className}`}
      style={{
        transform: `scale(${scale}) rotate(${isVox ? angle : 0}deg)`,
        backgroundColor: bgColor,
        color: textColor,
        padding: isVox ? "6px 14px" : "8px 18px",
        fontWeight: isVox ? 900 : 800,
        fontSize,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        borderRadius: isVox ? 0 : 6,
        boxShadow: isVox ? "3px 3px 0px rgba(0, 0, 0, 0.8)" : "0 4px 16px rgba(214, 27, 31, 0.4)",
        clipPath: isVox ? "polygon(0 0, 100% 2%, 99% 100%, 1% 98%)" : undefined,
      }}
    >
      <span
        className="mr-2.5 inline-block h-2.5 w-2.5 rounded-full"
        style={{
          backgroundColor: isVox ? "#000000" : "#FFFFFF",
          opacity: 0.9,
        }}
      />
      {text}
    </div>
  );
}
