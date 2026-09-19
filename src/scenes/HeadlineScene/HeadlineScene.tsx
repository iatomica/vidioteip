import React from "react";
import { Img } from "remotion";
import { HeadlineScene as HeadlineSceneType } from "../../compositions/NewsVideo/types";
import { ThemeTokens, ThemeName, getTheme } from "../../lib/config/themes";
import { useResponsive } from "../../lib/config/video";
import { HighlightedHeadline } from "../../components/text/HighlightedHeadline";
import { Subheadline } from "../../components/text/Subheadline";
import { TapeLabel } from "../../components/branding/TapeLabel";
import { NewsTicker } from "../../components/branding/NewsTicker";
import { GradientBackground } from "../../components/backgrounds/GradientBackground";
import { GridPulse } from "../../components/backgrounds/GridPulse";
import { KenBurnsImage } from "../../components/media/KenBurnsImage";
import { BrutalistFrame } from "../../components/branding/BrutalistFrame";
import { resolveAsset } from "../../lib/media/assets";

export interface HeadlineSceneProps {
  scene?: HeadlineSceneType;
  content?: HeadlineSceneType["content"];
  theme?: ThemeTokens | ThemeName;
}

export function HeadlineScene(props: HeadlineSceneProps) {
  const { isVertical } = useResponsive();
  const content = props.content ?? props.scene?.content;
  const theme = typeof props.theme === "string" ? getTheme(props.theme) : (props.theme ?? getTheme());

  if (!content) return null;

  const templateId = content.templateId || "design-1-black";
  const isLight = content.themeMode === "light" || templateId.includes("white");
  const headlineColor = isLight ? "#000000" : "#FFFFFF";

  const headlineSize = isVertical ? 76 : 68;
  const subheadlineSize = isVertical ? 38 : 32;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: isLight ? "#F8FAFC" : theme.background,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        paddingTop: isVertical ? 135 : 54,
        paddingBottom: isVertical ? 110 : 54,
        paddingLeft: isVertical ? 48 : 48,
        paddingRight: isVertical ? 48 : 48,
      }}
    >
      {/* Background */}
      {content.backgroundImage ? (
        <KenBurnsImage
          src={content.backgroundImage}
          durationInFrames={props.scene?.durationInFrames ?? 130}
          scaleFrom={1.0}
          scaleTo={1.04}
          overlay={true}
          overlayGradient={
            isVertical
              ? isLight
                ? "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 30%, rgba(255,255,255,0.2) 60%, rgba(248,250,252,0.85) 92%)"
                : `linear-gradient(180deg, rgba(11,13,18,0.2) 0%, rgba(11,13,18,0.05) 30%, rgba(11,13,18,0.3) 60%, ${theme.background}E6 92%)`
              : `linear-gradient(180deg, rgba(11,13,18,0.5) 0%, rgba(11,13,18,0.15) 30%, rgba(11,13,18,0.7) 55%, ${theme.background}FB 88%, ${theme.background} 100%)`
          }
        />
      ) : (
        <>
          <GradientBackground theme={theme} />
          <GridPulse theme={theme} />
        </>
      )}

      {/* Reel Vertical Template (in front of video/photo background, behind texts) */}
      {isVertical && (
        <Img
          src={resolveAsset(`assets/templates/reels/${templateId}.webp`)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 4,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Editorial Frame Overlays - only when not vertical */}
      {!isVertical && <BrutalistFrame theme={theme} />}

      {/* Center Core: Category Tag + Kinetic Highlighted Headline + Subheadline */}
      <div
        style={{
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          gap: isVertical ? 22 : 16,
          maxWidth: isVertical ? "100%" : "78%",
          margin: isVertical ? "auto 0 50px 0" : "auto 0 20px 0",
        }}
      >
        {/* Category Pill directly above the title */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <TapeLabel
            text={content.kicker ?? "ACTUALIDAD"}
            theme={theme}
            angle={0}
            fontSize={isVertical ? 28 : 18}
          />
        </div>

        <HighlightedHeadline
          text={content.title}
          theme={theme}
          fontSize={headlineSize}
          color={headlineColor}
          delay={5}
        />

        {content.subtitle && (
          <div
            style={{
              borderLeft: "5px solid #dc2626",
              backgroundColor: isLight ? "rgba(255, 255, 255, 0.96)" : "rgba(11, 13, 18, 0.85)",
              backdropFilter: "blur(14px)",
              padding: isVertical ? "18px 24px" : "14px 22px",
              borderRadius: "0 10px 10px 0",
              boxShadow: isLight ? "0 10px 30px rgba(0,0,0,0.18)" : "0 10px 30px rgba(0,0,0,0.65)",
            }}
          >
            <Subheadline
              text={content.subtitle}
              theme={theme}
              fontSize={subheadlineSize}
              color={isLight ? "#000000" : "#FFFFFF"}
              delay={14}
            />
          </div>
        )}
      </div>

      {/* Bottom Ticker */}
      {content.tickerItems && content.tickerItems.length > 0 && (
        <NewsTicker items={content.tickerItems} theme={theme} />
      )}
    </div>
  );
}
