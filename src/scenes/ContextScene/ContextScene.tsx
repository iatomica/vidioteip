import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ContextScene as ContextSceneType } from '../../compositions/NewsVideo/types';
import { ThemeTokens, ThemeName, getTheme } from '../../lib/config/themes';
import { useResponsive } from '../../lib/config/video';
import { fadeIn, slideIn, staggerDelay } from '../../lib/animation/primitives';
import { Kicker } from '../../components/text/Kicker';
import { Headline } from '../../components/text/Headline';
import { GradientBackground } from '../../components/backgrounds/GradientBackground';
import { GridPulse } from '../../components/backgrounds/GridPulse';

export interface ContextSceneProps {
  scene?: ContextSceneType;
  content?: ContextSceneType['content'];
  theme?: ThemeTokens | ThemeName;
}

export function ContextScene(props: ContextSceneProps) {
  const frame = useCurrentFrame();
  const content = props.content ?? props.scene?.content;
  const theme = typeof props.theme === 'string' ? getTheme(props.theme) : (props.theme ?? getTheme());
  const { isVertical } = useResponsive();

  if (!content) return null;

  const titleOpacity = fadeIn(frame, 0, 15);
  const titleSlide = slideIn(frame, 'up', 25, 0, 20);

  return (
    <div
      className="relative flex h-full w-full flex-col justify-center overflow-hidden p-8"
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.foreground,
        fontFamily: theme.typography.fontFamily,
      }}
    >
      <GradientBackground theme={theme} />
      <GridPulse theme={theme} />

      <div
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col justify-center"
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleSlide}px)`,
        }}
      >
        {content.kicker && (
          <Kicker
            text={content.kicker}
            theme={theme}
            className="mb-4 text-sm font-semibold tracking-widest uppercase"
          />
        )}

        <Headline
          text={content.title}
          theme={theme}
          className={`font-bold ${isVertical ? 'text-3xl' : 'text-5xl'} mb-8`}
        />

        <div className={`grid gap-4 ${isVertical ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {content.points.map((point: string, index: number) => {
            const delay = staggerDelay(index, 10, 15);
            const cardOpacity = fadeIn(frame, delay, 15);
            const cardSlide = slideIn(frame, 'up', 30, delay, 18);

            return (
              <div
                key={index}
                className="flex items-start gap-4 rounded-xl border p-5 backdrop-blur-md"
                style={{
                  opacity: cardOpacity,
                  transform: `translateY(${cardSlide}px)`,
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  borderColor: theme.colors.border,
                  boxShadow: theme.shadows.card,
                }}
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-bold"
                  style={{
                    backgroundColor: theme.colors.accent,
                    color: '#ffffff',
                  }}
                >
                  {index + 1}
                </div>
                <p
                  className={`${isVertical ? 'text-base' : 'text-lg'} leading-relaxed`}
                  style={{ color: theme.colors.mutedForeground }}
                >
                  {point}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
