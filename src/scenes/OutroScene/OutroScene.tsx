import React from 'react';
import { useCurrentFrame, Img } from 'remotion';
import { OutroScene as OutroSceneType } from '../../compositions/NewsVideo/types';
import { ThemeTokens, ThemeName, getTheme } from '../../lib/config/themes';
import { useResponsive } from '../../lib/config/video';
import { fadeIn, slideIn, springScale } from '../../lib/animation/primitives';
import { GradientBackground } from '../../components/backgrounds/GradientBackground';
import { BokehCircles } from '../../components/backgrounds/BokehCircles';
import { BrutalistFrame } from '../../components/branding/BrutalistFrame';
import { resolveAsset } from '../../lib/media/assets';

export interface OutroSceneProps {
  scene?: OutroSceneType;
  content?: OutroSceneType['content'];
  theme?: ThemeTokens | ThemeName;
}

export function OutroScene(props: OutroSceneProps) {
  const frame = useCurrentFrame();
  const content = props.content ?? props.scene?.content;
  const theme = typeof props.theme === 'string' ? getTheme(props.theme) : (props.theme ?? getTheme());
  const { isVertical } = useResponsive();

  if (!content) return null;

  const logoScale = springScale(frame, { delay: 4, damping: 10, stiffness: 140 });
  const titleOpacity = fadeIn(frame, 6, 12);
  const titleSlide = slideIn(frame, 'up', 20, 6, 15);

  const isVox = theme.name === 'vox-editorial';
  const isCalm = theme.name === 'editorial-calm';

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden p-8 text-center"
      style={{
        backgroundColor: theme.background,
        color: theme.foreground,
        fontFamily: theme.typography.fontFamily,
      }}
    >
      <GradientBackground theme={theme} />
      <BokehCircles theme={theme} count={5} />
      <BrutalistFrame theme={theme} issueCode="END // BROADCAST" />

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center">
        {/* Brand / Channel Logo */}
        <div
          className="mb-8 flex items-center justify-center"
          style={{
            transform: `scale(${logoScale}) rotate(${isVox ? -2 : 0}deg)`,
            filter: "drop-shadow(0 16px 40px rgba(0, 0, 0, 0.8))",
          }}
        >
          <Img
            src={resolveAsset("images/bariloche/anb-logo.png")}
            style={{
              height: isVertical ? (isCalm ? 116 : 96) : 74,
              width: "auto",
              objectFit: "contain",
              borderRadius: 6,
            }}
          />
        </div>

        {/* Text: "Noticias de la Patagonia" */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translate3d(0, ${titleSlide}px, 0)`,
          }}
        >
          <h2
            style={{
              fontFamily: theme.headlineFont,
              fontSize: isVertical ? 42 : 36,
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: "0.04em",
              margin: 0,
              textShadow: "0 4px 25px rgba(0, 0, 0, 0.95)",
              textTransform: "uppercase",
            }}
          >
            Noticias de la Patagonia
          </h2>
        </div>
      </div>
    </div>
  );
}
