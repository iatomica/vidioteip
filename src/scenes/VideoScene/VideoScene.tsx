import React from "react";
import { VideoScene as VideoSceneType } from "../../compositions/NewsVideo/types";
import { ThemeTokens, ThemeName, getTheme } from "../../lib/config/themes";
import { useResponsive } from "../../lib/config/video";
import { BackgroundVideo } from "../../components/media/BackgroundVideo";
import { SourcePill } from "../../components/branding/SourcePill";
import { LowerThird } from "../../components/text/LowerThird";

export interface VideoSceneProps {
  scene?: VideoSceneType;
  content?: VideoSceneType["content"];
  theme?: ThemeTokens | ThemeName;
}

export function VideoScene(props: VideoSceneProps) {
  const { safeArea } = useResponsive();
  const content = props.content ?? props.scene?.content;
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
        paddingBottom: safeArea.bottom + 24,
        paddingLeft: safeArea.left + 16,
        paddingRight: safeArea.right + 16,
      }}
    >
      {/* Video Background */}
      <BackgroundVideo
        src={content.src}
        muted={content.muted}
        playbackRate={content.playbackRate}
        overlay={content.overlay}
        overlayGradient={`linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, ${theme.background}EE 90%)`}
      />

      {/* Top Source Pill */}
      <div style={{ zIndex: 10 }}>
        {content.source && <SourcePill source={content.source} theme={theme} />}
      </div>

      {/* Bottom Caption */}
      <div style={{ zIndex: 10, maxWidth: 850 }}>
        {content.caption && (
          <LowerThird
            primary={content.caption}
            theme={theme}
            delay={10}
          />
        )}
      </div>
    </div>
  );
}
