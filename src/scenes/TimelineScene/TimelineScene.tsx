import React from "react";
import { useCurrentFrame } from "remotion";
import { TimelineScene as TimelineSceneType } from "../../compositions/NewsVideo/types";
import { ThemeTokens, ThemeName, getTheme } from "../../lib/config/themes";
import { useResponsive } from "../../lib/config/video";
import { fadeIn, slideIn } from "../../lib/animation/primitives";
import { GradientBackground } from "../../components/backgrounds/GradientBackground";

export interface TimelineSceneProps {
  scene?: TimelineSceneType;
  content?: TimelineSceneType["content"];
  theme?: ThemeTokens | ThemeName;
}

export function TimelineScene(props: TimelineSceneProps) {
  const frame = useCurrentFrame();
  const { safeArea } = useResponsive();
  const content = props.content ?? props.scene?.content;
  const theme = typeof props.theme === "string" ? getTheme(props.theme) : (props.theme ?? getTheme());

  if (!content) return null;

  const titleOpacity = fadeIn(frame, 4, 14);

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
        paddingBottom: safeArea.bottom + 20,
        paddingLeft: safeArea.left + 24,
        paddingRight: safeArea.right + 24,
      }}
    >
      <GradientBackground theme={theme} subtle />

      {/* Header */}
      <div style={{ zIndex: 10, opacity: titleOpacity }}>
        <span
          style={{
            fontFamily: theme.fontFamily,
            fontSize: 14,
            fontWeight: 800,
            color: theme.accent,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            display: "block",
            marginBottom: 6,
          }}
        >
          {content.kicker ?? "DEVELOPING TIMELINE"}
        </span>
        <h2
          style={{
            fontFamily: theme.headlineFont,
            fontSize: 44,
            fontWeight: 800,
            color: theme.foreground,
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          {content.title}
        </h2>
      </div>

      {/* Timeline Steps */}
      <div
        style={{
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          gap: 28,
          position: "relative",
          margin: "auto 0",
          paddingLeft: 32,
          borderLeft: `3px solid ${theme.surfaceBorder}`,
        }}
      >
        {content.steps.map((step: { time: string; label: string; description?: string }, idx: number) => {
          const stepDelay = 12 + idx * 10;
          const stepOpacity = fadeIn(frame, stepDelay, 15);
          const stepY = slideIn(frame, "up", 20, stepDelay, 18);

          return (
            <div
              key={idx}
              style={{
                position: "relative",
                opacity: stepOpacity,
                transform: `translateY(${stepY}px)`,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              {/* Timeline Indicator Dot */}
              <div
                style={{
                  position: "absolute",
                  left: -39,
                  top: 4,
                  width: 15,
                  height: 15,
                  borderRadius: "50%",
                  backgroundColor: theme.accent,
                  border: `3px solid ${theme.background}`,
                  boxShadow: `0 0 10px ${theme.accent}66`,
                }}
              />

              {/* Time pill */}
              <span
                style={{
                  fontFamily: theme.fontFamily,
                  fontSize: 13,
                  fontWeight: 800,
                  color: theme.accent,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {step.time}
              </span>

              {/* Step label */}
              <span
                style={{
                  fontFamily: theme.headlineFont,
                  fontSize: 24,
                  fontWeight: 700,
                  color: theme.foreground,
                }}
              >
                {step.label}
              </span>

              {/* Description */}
              {step.description && (
                <span
                  style={{
                    fontFamily: theme.fontFamily,
                    fontSize: 16,
                    color: theme.foregroundMuted,
                    lineHeight: 1.4,
                  }}
                >
                  {step.description}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ zIndex: 10, height: 10 }} />
    </div>
  );
}
