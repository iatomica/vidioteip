import React from 'react';
import { useCurrentFrame } from 'remotion';
import { MapScene as MapSceneType } from '../../compositions/NewsVideo/types';
import { ThemeTokens, ThemeName, getTheme } from '../../lib/config/themes';
import { useResponsive } from '../../lib/config/video';
import { fadeIn, slideIn, springScale, interpolateValue } from '../../lib/animation/primitives';
import { Kicker } from '../../components/text/Kicker';
import { Headline } from '../../components/text/Headline';
import { GradientBackground } from '../../components/backgrounds/GradientBackground';
import { GridPulse } from '../../components/backgrounds/GridPulse';

export interface MapSceneProps {
  scene?: MapSceneType;
  content?: MapSceneType['content'];
  theme?: ThemeTokens | ThemeName;
}

export function MapScene(props: MapSceneProps) {
  const frame = useCurrentFrame();
  const content = props.content ?? props.scene?.content;
  const theme = typeof props.theme === 'string' ? getTheme(props.theme) : (props.theme ?? getTheme());
  const { isVertical } = useResponsive();

  if (!content) return null;

  const locationText = content.location ?? content.locationName ?? 'SIGNAL ORIGIN';
  const descriptionText = content.description ?? content.context ?? content.region;

  const titleOpacity = fadeIn(frame, 0, 15);
  const titleSlide = slideIn(frame, 'up', 25, 0, 20);

  // Radar/target pulse animation
  const radarScale = springScale(frame, 30);
  const pulse1 = interpolateValue(frame % 60, [0, 60], [10, 90]);
  const pulse1Opacity = interpolateValue(frame % 60, [0, 50, 60], [0.8, 0.1, 0]);

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
        className={`relative z-10 mx-auto flex w-full max-w-5xl ${
          isVertical ? 'flex-col items-center text-center' : 'flex-row items-center justify-between'
        } gap-8`}
      >
        {/* Text Info */}
        <div
          className={`flex flex-col ${isVertical ? 'items-center' : 'items-start'} max-w-xl`}
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleSlide}px)`,
          }}
        >
          {content.kicker && (
            <Kicker
              text={content.kicker}
              theme={theme}
              className="mb-3 text-xs font-semibold tracking-widest uppercase"
            />
          )}

          <Headline
            text={locationText}
            theme={theme}
            className={`font-bold ${isVertical ? 'text-4xl' : 'text-5xl'} mb-3`}
          />

          {descriptionText && (
            <p
              className={`${isVertical ? 'text-base' : 'text-lg'} mb-4 leading-relaxed`}
              style={{ color: theme.colors.mutedForeground }}
            >
              {descriptionText}
            </p>
          )}

          {content.coordinates && (
            <div
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-xs"
              style={{
                borderColor: theme.colors.border,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: theme.colors.accent,
              }}
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
              <span>COORDS: {content.coordinates}</span>
            </div>
          )}
        </div>

        {/* Vector Radar / Locator HUD */}
        <div
          className="relative flex items-center justify-center"
          style={{
            width: isVertical ? 260 : 320,
            height: isVertical ? 260 : 320,
            transform: `scale(${radarScale})`,
          }}
        >
          <svg className="h-full w-full" viewBox="0 0 200 200">
            {/* Concentric rings */}
            <circle cx="100" cy="100" r="80" fill="none" stroke={theme.colors.border} strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="100" cy="100" r="55" fill="none" stroke={theme.colors.border} strokeWidth="1" />
            <circle cx="100" cy="100" r="30" fill="none" stroke={theme.colors.border} strokeWidth="1" strokeDasharray="2 2" />

            {/* Radar crosshairs */}
            <line x1="100" y1="10" x2="100" y2="190" stroke={theme.colors.border} strokeWidth="1" opacity="0.6" />
            <line x1="10" y1="100" x2="190" y2="100" stroke={theme.colors.border} strokeWidth="1" opacity="0.6" />

            {/* Dynamic radar ping */}
            <circle
              cx="100"
              cy="100"
              r={pulse1}
              fill="none"
              stroke={theme.colors.accent}
              strokeWidth="2"
              opacity={pulse1Opacity}
            />

            {/* Center target marker */}
            <circle cx="100" cy="100" r="7" fill={theme.colors.accent} />
            <circle cx="100" cy="100" r="14" fill="none" stroke={theme.colors.accent} strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}
