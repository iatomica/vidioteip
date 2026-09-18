import React from "react";
import { ImageScene as ImageSceneType } from "../../compositions/NewsVideo/types";
import { ThemeTokens, ThemeName, getTheme } from "../../lib/config/themes";
import { useResponsive } from "../../lib/config/video";
import { KenBurnsImage } from "../../components/media/KenBurnsImage";
import { SourcePill } from "../../components/branding/SourcePill";
import { TapeLabel } from "../../components/branding/TapeLabel";
import { BrutalistFrame } from "../../components/branding/BrutalistFrame";

export interface ImageSceneProps {
  scene?: ImageSceneType;
  content?: ImageSceneType["content"];
  durationInFrames?: number;
  duration?: number;
  theme?: ThemeTokens | ThemeName;
}

export function ImageScene(props: ImageSceneProps) {
  const { safeArea, isVertical } = useResponsive();
  const content = props.content ?? props.scene?.content;
  const durationInFrames =
    props.durationInFrames ?? props.duration ?? props.scene?.durationInFrames ?? props.scene?.duration ?? 120;
  const theme = typeof props.theme === "string" ? getTheme(props.theme) : (props.theme ?? getTheme());

  if (!content) return null;

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
        paddingTop: safeArea.top + 16,
        paddingBottom: safeArea.bottom + 28,
        paddingLeft: safeArea.left + 20,
        paddingRight: safeArea.right + 20,
      }}
    >
      {/* Background Ken Burns Image with dynamic cinematic pan/zoom */}
      <KenBurnsImage
        src={content.src}
        durationInFrames={durationInFrames}
        scaleFrom={content.scaleFrom}
        scaleTo={content.scaleTo}
        xFrom={content.xFrom}
        xTo={content.xTo}
        yFrom={content.yFrom}
        yTo={content.yTo}
        overlay={content.overlay}
        overlayGradient={`linear-gradient(180deg, rgba(12,13,17,0.35) 0%, rgba(12,13,17,0.1) 40%, ${theme.background}FA 92%)`}
      />

      {/* Brutalist editorial frame crosshairs */}
      <BrutalistFrame theme={theme} issueCode="VISUAL // ARCHIVE" />

      {/* Top Source Pill */}
      <div style={{ zIndex: 10 }}>
        {content.source && <SourcePill source={content.source} theme={theme} />}
      </div>

      {/* Bottom Editorial Caption Card */}
      <div
        style={{
          zIndex: 10,
          maxWidth: isVertical ? "100%" : 900,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <TapeLabel text="KEY EVIDENCE" theme={theme} angle={-1} />

        {content.caption && (
          <div
            style={{
              padding: "16px 20px",
              backgroundColor: "rgba(12, 13, 17, 0.85)",
              backdropFilter: "blur(12px)",
              border: `2px solid ${theme.surfaceBorder}`,
              borderLeft: `6px solid ${theme.accent}`,
              boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
            }}
          >
            <p
              style={{
                fontFamily: theme.headlineFont,
                fontSize: isVertical ? 22 : 28,
                fontWeight: 900,
                color: theme.foreground,
                lineHeight: 1.25,
                margin: 0,
              }}
            >
              {content.caption}
            </p>
            {content.alt && (
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: 13,
                  color: theme.foregroundMuted,
                  marginTop: 6,
                  marginBottom: 0,
                }}
              >
                ↳ {content.alt}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
