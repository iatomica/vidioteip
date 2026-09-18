import React from "react";
import { interpolate, useCurrentFrame, spring } from "remotion";
import { TransitionType } from "../../compositions/NewsVideo/types";

export interface TransitionWrapperProps {
  type?: TransitionType;
  transition?: TransitionType;
  durationInFrames: number;
  transitionFrames?: number;
  children: React.ReactNode;
}

export function TransitionWrapper({
  type,
  transition,
  durationInFrames,
  transitionFrames: transitionFramesProp,
  children,
}: TransitionWrapperProps) {
  const frame = useCurrentFrame();
  const transitionType = transition ?? type ?? "wipe-snap";
  const transitionFrames = transitionFramesProp ?? (transitionType === "fade" ? 16 : 10);

  if (transitionType === "none" || transitionFrames <= 0) {
    return <div style={{ width: "100%", height: "100%" }}>{children}</div>;
  }

  // Entrance progress: 0 -> 1 during [0, transitionFrames]
  const enterProgress = interpolate(frame, [0, transitionFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Exit progress: 0 -> 1 during [durationInFrames - transitionFrames, durationInFrames]
  const exitProgress = interpolate(
    frame,
    [durationInFrames - transitionFrames, durationInFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  let style: React.CSSProperties = {
    width: "100%",
    height: "100%",
    position: "relative",
  };

  let overlayNode: React.ReactNode = null;

  switch (transitionType) {
    case "wipe-snap": {
      // Bold diagonal/horizontal wipe bar
      const wipeTranslate = (1 - enterProgress) * 100 - exitProgress * 100;
      style = {
        ...style,
        transform: `translate3d(${wipeTranslate}%, 0, 0)`,
      };
      // Neon accent leading-edge bar
      if (enterProgress < 1 || exitProgress > 0) {
        overlayNode = (
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              width: 12,
              backgroundColor: "#D4FF00",
              boxShadow: "0 0 25px #D4FF00, -5px 0 35px rgba(212, 255, 0, 0.8)",
              zIndex: 999,
              pointerEvents: "none",
            }}
          />
        );
      }
      break;
    }

    case "crash-zoom": {
      // High-speed zoom with optical blur
      const enterScale = 0.82 + enterProgress * 0.18;
      const exitScale = 1.0 + exitProgress * 0.45;
      const scale = exitProgress > 0 ? exitScale : enterScale;

      const enterBlur = (1 - enterProgress) * 10;
      const exitBlur = exitProgress * 14;
      const blur = Math.max(enterBlur, exitBlur);

      const opacity = enterProgress * (1 - exitProgress);

      style = {
        ...style,
        transform: `scale(${scale.toFixed(4)})`,
        filter: blur > 0.4 ? `blur(${blur.toFixed(1)}px)` : undefined,
        opacity,
      };
      break;
    }

    case "elastic-slide": {
      // Overshoot spring physics entrance
      const spr = spring({
        frame,
        fps: 30,
        config: { damping: 11, stiffness: 140, mass: 0.7 },
      });
      const translateX = (1 - Math.min(1.1, spr)) * 80 - exitProgress * 100;
      style = {
        ...style,
        transform: `translate3d(${translateX.toFixed(2)}%, 0, 0)`,
      };
      break;
    }

    case "flash-cut": {
      // High impact strobe flash (white/lime strobe on cut)
      const flashOpacity =
        frame < 3
          ? interpolate(frame, [0, 3], [0.9, 0], { extrapolateRight: "clamp" })
          : frame >= durationInFrames - 2
          ? interpolate(frame, [durationInFrames - 2, durationInFrames], [0, 0.8], { extrapolateLeft: "clamp" })
          : 0;

      style = {
        ...style,
        opacity: enterProgress * (1 - exitProgress * 0.3),
      };

      if (flashOpacity > 0.05) {
        overlayNode = (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "#D4FF00",
              opacity: flashOpacity,
              mixBlendMode: "screen",
              pointerEvents: "none",
              zIndex: 999,
            }}
          />
        );
      }
      break;
    }

    case "whip": {
      const translateX = (1 - enterProgress) * 120 - exitProgress * 120;
      const blurAmount = (1 - enterProgress + exitProgress) * 12;
      style = {
        ...style,
        transform: `translate3d(${translateX.toFixed(1)}%, 0, 0)`,
        filter: blurAmount > 0.5 ? `blur(${blurAmount.toFixed(1)}px)` : undefined,
      };
      break;
    }

    case "fade-through-black": {
      const opacity = enterProgress * (1 - exitProgress);
      style = {
        ...style,
        opacity,
        backgroundColor: "#000000",
      };
      break;
    }

    case "slide": {
      const translateX = (1 - enterProgress) * 100 - exitProgress * 100;
      style = {
        ...style,
        transform: `translate3d(${translateX}%, 0, 0)`,
      };
      break;
    }

    case "push": {
      const translateY = (1 - enterProgress) * 100 - exitProgress * 100;
      style = {
        ...style,
        transform: `translate3d(0, ${translateY}%, 0)`,
      };
      break;
    }

    case "zoom": {
      const scale = 0.88 + enterProgress * 0.12 - exitProgress * 0.08;
      const opacity = enterProgress * (1 - exitProgress);
      style = {
        ...style,
        transform: `scale(${scale.toFixed(4)})`,
        opacity,
      };
      break;
    }

    case "fade":
    default: {
      // Gentle sinusoidal easing for calm, subtle cross-dissolve
      const enterEase = Math.sin((enterProgress * Math.PI) / 2);
      const exitEase = Math.sin(((1 - exitProgress) * Math.PI) / 2);
      const opacity = enterEase * exitEase;
      style = { ...style, opacity };
      break;
    }
  }

  return (
    <div style={style}>
      {children}
      {overlayNode}
    </div>
  );
}
