import React from "react";
import { useCurrentFrame } from "remotion";
import { ThemeTokens } from "../../lib/config/themes";

interface LiveBadgeProps {
  text?: string;
  theme: ThemeTokens;
  fontSize?: number;
}

export function LiveBadge({ text = "SPECIAL REPORT", theme, fontSize = 16 }: LiveBadgeProps) {
  const frame = useCurrentFrame();
  const pulseOpacity = 0.4 + Math.sin(frame * 0.15) * 0.6;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 18px",
        borderRadius: theme.borderRadius.sm,
        backgroundColor: theme.badgeBackground,
        color: "#FFFFFF",
        fontFamily: theme.fontFamily,
        fontSize,
        fontWeight: 900,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        boxShadow: "0 4px 16px rgba(214, 27, 31, 0.45)",
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "#FFFFFF",
          opacity: pulseOpacity,
        }}
      />
      {text}
    </div>
  );
}
