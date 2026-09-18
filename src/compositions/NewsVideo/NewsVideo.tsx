import React from 'react';
import { Sequence, useCurrentFrame, Audio, Img } from 'remotion';
import { NewsVideoProps } from './types';
import { buildTimeline } from '../../lib/timing/timeline';
import { SceneRenderer } from '../../scenes/SceneRenderer';
import { TransitionWrapper } from '../../components/transitions/TransitionWrapper';
import { SafeZoneOverlay } from '../../components/safe-areas/SafeZoneOverlay';
import { DebugOverlay } from '../../components/overlays/DebugOverlay';
import { NewsTicker } from '../../components/branding/NewsTicker';
import { resolveAsset } from '../../lib/media/assets';
import { fadeIn, fadeOut } from '../../lib/animation/primitives';
import { useResponsive } from '../../lib/config/video';

export const NewsVideo: React.FC<NewsVideoProps> = ({
  theme = 'news-modern',
  scenes,
  audio,
  tickerItems,
  showSafeAreas = false,
  debug = false,
}) => {
  const currentFrame = useCurrentFrame();
  const { isVertical } = useResponsive();
  const timeline = buildTimeline(scenes);

  // Find when outro starts so the fixed logo can fade out gracefully
  const outroItem = timeline.find((item) => item.scene.type === 'outro');
  const outroStartFrame = outroItem ? outroItem.startFrame : (timeline[timeline.length - 1]?.endFrame ?? 300);

  // Fixed logo fades in at intro, stays fixed throughout news scenes, and fades out when outro enters
  const logoFadeIn = fadeIn(currentFrame, 2, 14);
  const logoFadeOut = fadeOut(currentFrame, outroStartFrame - 16, 16);
  const fixedLogoOpacity = logoFadeIn * logoFadeOut;

  // Determine currently active scene for debug HUD
  const activeItem = timeline.find(
    (item) => currentFrame >= item.startFrame && currentFrame < item.endFrame
  );
  const activeSceneType = activeItem ? `${activeItem.scene.type} (${activeItem.scene.id})` : undefined;

  return (
    <div className="relative h-full w-full overflow-hidden bg-black select-none">
      {/* Background Audio with automated fade in & out */}
      {audio?.src && (
        <Audio
          src={resolveAsset(audio.src)}
          volume={(frame) => {
            const baseVolume = audio.volume ?? 0.3;
            const fadeInMultiplier = fadeIn(frame, 0, 30);
            const totalFrames = timeline[timeline.length - 1]?.endFrame ?? 300;
            const fadeOutMultiplier = fadeOut(frame, totalFrames - 30, 30);
            return baseVolume * fadeInMultiplier * fadeOutMultiplier;
          }}
        />
      )}

      {/* Persistent Fixed Brand Logo across news stories (fades out at outro) */}
      {fixedLogoOpacity > 0.005 && (
        <div
          style={{
            position: 'absolute',
            top: isVertical ? 290 : 54,
            left: isVertical ? 48 : 36,
            zIndex: 40,
            opacity: fixedLogoOpacity,
            pointerEvents: 'none',
          }}
        >
          <Img
            src={resolveAsset('images/bariloche/anb-logo.png')}
            style={{
              height: isVertical ? 82 : 56,
              width: 'auto',
              objectFit: 'contain',
              borderRadius: 6,
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.85)',
            }}
          />
        </div>
      )}

      {/* Sequenced Scenes */}
      {timeline.map((item) => (
        <Sequence
          key={item.scene.id}
          from={item.startFrame}
          durationInFrames={item.durationInFrames}
        >
          <TransitionWrapper
            transition={item.scene.transition}
            durationInFrames={item.durationInFrames}
          >
            <SceneRenderer scene={item.scene} globalTheme={theme} />
          </TransitionWrapper>
        </Sequence>
      ))}

      {/* Persistent Breaking News Ticker if configured */}
      {tickerItems && tickerItems.length > 0 && (
        <div className="absolute bottom-10 left-0 right-0 z-30 pointer-events-none px-4">
          <NewsTicker items={tickerItems} theme={theme} speed={1.5} />
        </div>
      )}

      {/* Safe Areas Overlay for Instagram Reels / TikTok / Shorts */}
      <SafeZoneOverlay show={showSafeAreas} />

      {/* Live HUD Debug Overlay */}
      <DebugOverlay show={debug} activeScene={activeSceneType} />
    </div>
  );
};
