import React from "react";
import { useCurrentFrame } from "remotion";
import { counterValue, fadeIn, springScale } from "../../lib/animation/primitives";
import { ThemeTokens, ThemeName, getTheme } from "../../lib/config/themes";

interface NumberStatProps {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  context?: string;
  comparison?: string;
  theme?: ThemeTokens | ThemeName;
  delay?: number;
  duration?: number;
}

export function NumberStat({
  value,
  prefix = "",
  suffix = "",
  label,
  context,
  comparison,
  theme: themeProp = "news-modern",
  delay = 5,
  duration = 45,
}: NumberStatProps) {
  const frame = useCurrentFrame();
  const theme = typeof themeProp === "string" ? getTheme(themeProp) : (themeProp ?? getTheme());
  const animatedNumber = counterValue(frame, { startFrame: delay, duration, to: value });
  const scale = springScale(frame, { delay, damping: 10, stiffness: 120 });
  const opacity = fadeIn(frame, delay, 12);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 12,
        padding: 32,
        backgroundColor: "rgba(30, 41, 59, 0.5)",
        backdropFilter: "blur(12px)",
        border: `1px solid ${theme.surfaceBorder}`,
        borderRadius: theme.borderRadius.lg,
        boxShadow: theme.shadow,
        opacity,
      }}
    >
      {/* Big Animated Number */}
      <div
        style={{
          fontFamily: theme.headlineFont,
          fontSize: 104,
          fontWeight: 900,
          color: theme.accent,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          transform: `scale(${scale})`,
          textShadow: `0 0 40px ${theme.accent}66`,
        }}
      >
        {prefix}
        {animatedNumber.toLocaleString("en-US")}
        {suffix}
      </div>

      {/* Main Metric Label */}
      <div
        style={{
          fontFamily: theme.headlineFont,
          fontSize: 28,
          fontWeight: 800,
          color: theme.foreground,
          letterSpacing: "-0.01em",
          maxWidth: 600,
        }}
      >
        {label}
      </div>

      {/* Context or Comparison Note */}
      {(context || comparison) && (
        <div
          style={{
            fontFamily: theme.fontFamily,
            fontSize: 16,
            fontWeight: 500,
            color: theme.foregroundMuted,
            maxWidth: 520,
            lineHeight: 1.4,
            borderTop: `1px solid ${theme.surfaceBorder}`,
            paddingTop: 12,
            marginTop: 4,
          }}
        >
          {comparison || context}
        </div>
      )}
    </div>
  );
}
