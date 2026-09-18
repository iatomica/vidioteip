import React from "react";
import { useCurrentFrame } from "remotion";
import { QuoteScene as QuoteSceneType } from "../../compositions/NewsVideo/types";
import { ThemeTokens, ThemeName, getTheme } from "../../lib/config/themes";
import { useResponsive } from "../../lib/config/video";
import { fadeIn, slideIn } from "../../lib/animation/primitives";
import { GradientBackground } from "../../components/backgrounds/GradientBackground";
import { BokehCircles } from "../../components/backgrounds/BokehCircles";
import { SourcePill } from "../../components/branding/SourcePill";
import { BrutalistFrame } from "../../components/branding/BrutalistFrame";

export interface QuoteSceneProps {
  scene?: QuoteSceneType;
  content?: QuoteSceneType["content"];
  theme?: ThemeTokens | ThemeName;
}

export function QuoteScene(props: QuoteSceneProps) {
  const frame = useCurrentFrame();
  const { isVertical, safeArea } = useResponsive();
  const content = props.content ?? props.scene?.content;
  const theme = typeof props.theme === "string" ? getTheme(props.theme) : (props.theme ?? getTheme());

  if (!content) return null;

  const opacity = fadeIn(frame, 4, 12);
  const translateY = slideIn(frame, "up", 30, 4, 16);

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
        justifyContent: "space-between",
        paddingTop: safeArea.top + 20,
        paddingBottom: safeArea.bottom + 24,
        paddingLeft: safeArea.left + 24,
        paddingRight: safeArea.right + 24,
      }}
    >
      <GradientBackground theme={theme} />
      <BokehCircles theme={theme} count={5} />
      <BrutalistFrame theme={theme} issueCode="VERBATIM // QUOTE" />

      {/* Top Source */}
      <div style={{ zIndex: 10 }}>
        {content.source && <SourcePill source={content.source} theme={theme} />}
      </div>

      {/* Center High-Impact Quote Card */}
      <div
        style={{
          zIndex: 10,
          margin: "auto 0",
          maxWidth: 960,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 24,
          padding: isVertical ? "40px 30px" : "48px 44px",
          backgroundColor: theme.surface,
          border: `2px solid ${theme.surfaceBorder}`,
          borderLeft: `8px solid ${theme.accent}`,
          boxShadow: theme.shadows.hard,
          opacity,
          transform: `translate3d(0, ${translateY}px, 0)`,
        }}
      >
        {/* Giant decorative watermark quotation mark */}
        <span
          style={{
            position: "absolute",
            top: -10,
            right: 20,
            fontFamily: "Georgia, serif",
            fontSize: 140,
            lineHeight: 1,
            color: theme.accent,
            opacity: 0.15,
            pointerEvents: "none",
            fontWeight: 900,
          }}
        >
          “
        </span>

        {/* Quote text */}
        <p
          style={{
            fontFamily: theme.fontFamily,
            fontSize: isVertical ? 32 : 40,
            fontWeight: 700,
            lineHeight: 1.28,
            color: theme.foreground,
            margin: 0,
            zIndex: 1,
            letterSpacing: "-0.01em",
          }}
        >
          “{content.quote}”
        </p>

        {/* Author attribution & badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, zIndex: 1, flexWrap: "wrap" }}>
          <span
            style={{
              fontFamily: theme.headlineFont,
              fontSize: 22,
              fontWeight: 900,
              color: theme.accent,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
            }}
          >
            — {content.author}
          </span>
          {content.role && (
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 12,
                fontWeight: 600,
                color: "#000000",
                backgroundColor: theme.accent,
                padding: "3px 10px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                borderRadius: 2,
              }}
            >
              {content.role}
            </span>
          )}
        </div>
      </div>

      <div style={{ zIndex: 10, height: 20 }} />
    </div>
  );
}
