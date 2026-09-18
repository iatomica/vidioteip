import React from "react";
import { ThemeTokens } from "../../lib/config/themes";

interface SourcePillProps {
  source: string;
  theme: ThemeTokens;
  fontSize?: number;
}

export function SourcePill({ source, theme, fontSize = 15 }: SourcePillProps) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 18px",
        borderRadius: theme.borderRadius.full,
        backgroundColor: "rgba(11, 13, 18, 0.75)",
        backdropFilter: "blur(10px)",
        border: `1px solid ${theme.surfaceBorder}`,
        color: "#E2E8F0",
        fontFamily: theme.fontFamily,
        fontSize,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: theme.accent,
        }}
      />
      SOURCE: {source}
    </div>
  );
}
