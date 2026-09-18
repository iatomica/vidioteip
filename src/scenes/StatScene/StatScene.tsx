import React from "react";
import { useCurrentFrame } from "remotion";
import { StatScene as StatSceneType } from "../../compositions/NewsVideo/types";
import { ThemeTokens, ThemeName, getTheme } from "../../lib/config/themes";
import { useResponsive } from "../../lib/config/video";
import { counterValue, fadeIn, springScale } from "../../lib/animation/primitives";
import { GradientBackground } from "../../components/backgrounds/GradientBackground";
import { GridPulse } from "../../components/backgrounds/GridPulse";
import { TapeLabel } from "../../components/branding/TapeLabel";
import { BrutalistFrame } from "../../components/branding/BrutalistFrame";

export interface StatSceneProps {
  scene?: StatSceneType;
  content?: StatSceneType["content"];
  durationInFrames?: number;
  duration?: number;
  theme?: ThemeTokens | ThemeName;
}

export function StatScene(props: StatSceneProps) {
  const frame = useCurrentFrame();
  const { safeArea, isVertical } = useResponsive();
  const content = props.content ?? props.scene?.content;
  const durationInFrames =
    props.durationInFrames ?? props.duration ?? props.scene?.durationInFrames ?? props.scene?.duration ?? 120;
  const theme = typeof props.theme === "string" ? getTheme(props.theme) : (props.theme ?? getTheme());

  if (!content) return null;

  const value = content.value ?? content.numberValue ?? 0;
  const prefix = content.prefix ?? content.numberPrefix ?? "";
  const suffix = content.suffix ?? content.numberSuffix ?? "";
  const decimals = content.decimals ?? 0;

  const animatedNumber = counterValue(frame, {
    startFrame: 6,
    duration: Math.min(45, durationInFrames - 20),
    from: 0,
    to: value,
    decimals,
  });

  const scale = springScale(frame, { delay: 4, damping: 10, stiffness: 130 });
  const cardOpacity = fadeIn(frame, 2, 12);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: theme.background,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: safeArea.top + 20,
        paddingBottom: safeArea.bottom + 20,
        paddingLeft: safeArea.left + 20,
        paddingRight: safeArea.right + 20,
      }}
    >
      <GradientBackground theme={theme} />
      <GridPulse theme={theme} />
      <BrutalistFrame theme={theme} issueCode="DATA // METRIC 01" />

      {/* Main Kinetic Stat Card */}
      <div
        style={{
          zIndex: 10,
          width: "100%",
          maxWidth: isVertical ? "100%" : 880,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 16,
          padding: isVertical ? "40px 24px" : "48px 40px",
          backgroundColor: theme.surface,
          border: `2px solid ${theme.accent}`,
          boxShadow: theme.shadows.hard,
          opacity: cardOpacity,
          position: "relative",
        }}
      >
        {/* Kicker Sticker Badge */}
        {content.kicker && (
          <div style={{ position: "absolute", top: -16, left: 24 }}>
            <TapeLabel text={content.kicker} theme={theme} angle={-1} />
          </div>
        )}

        {/* Giant Kinetic Number */}
        <div
          style={{
            fontFamily: theme.headlineFont,
            fontSize: isVertical ? 108 : 136,
            fontWeight: 900,
            color: theme.accent,
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            transform: `scale(${scale})`,
            filter: `drop-shadow(0 0 25px ${theme.accent}66)`,
            marginTop: content.kicker ? 10 : 0,
          }}
        >
          {prefix}
          {animatedNumber.toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })}
          {suffix}
        </div>

        {/* Main Metric Label */}
        <div
          style={{
            fontFamily: theme.headlineFont,
            fontSize: isVertical ? 30 : 38,
            fontWeight: 900,
            color: theme.foreground,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            maxWidth: 680,
            lineHeight: 1.1,
          }}
        >
          {content.label}
        </div>

        {/* Comparison / Context Tape Box */}
        {(content.comparison || content.context) && (
          <div
            style={{
              marginTop: 8,
              padding: "10px 18px",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              border: `1px dashed ${theme.surfaceBorder}`,
              fontFamily: "monospace",
              fontSize: isVertical ? 14 : 16,
              color: theme.foregroundMuted,
              maxWidth: 580,
              lineHeight: 1.4,
              letterSpacing: "0.02em",
            }}
          >
            ↳ {content.comparison || content.context}
          </div>
        )}
      </div>
    </div>
  );
}
