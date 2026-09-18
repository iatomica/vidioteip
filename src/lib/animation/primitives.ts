import { interpolate, spring } from "remotion";

export const interpolateValue = interpolate;

export interface FadeOptions {
  delay?: number;
  duration?: number;
}

/**
 * Computes deterministic fade-in opacity (0 -> 1).
 * Supports either options object or positional (frame, delay, duration).
 */
export function fadeIn(
  frame: number,
  delayOrOptions: number | FadeOptions = 0,
  durationArg: number = 15
): number {
  let delay = 0;
  let duration = 15;

  if (typeof delayOrOptions === "number") {
    delay = delayOrOptions;
    duration = durationArg;
  } else if (delayOrOptions) {
    delay = delayOrOptions.delay ?? 0;
    duration = delayOrOptions.duration ?? 15;
  }

  return interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

/**
 * Computes deterministic fade-out opacity (1 -> 0)
 */
export function fadeOut(frame: number, exitFrame: number, duration: number = 15): number {
  return interpolate(frame, [exitFrame - duration, exitFrame], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export interface SlideOptions {
  delay?: number;
  duration?: number;
  distance?: number;
  direction?: "up" | "down" | "left" | "right";
}

/**
 * Computes slide translation offset in pixels.
 * Supports options object or positional (frame, direction, distance, delay, duration).
 */
export function slideIn(
  frame: number,
  directionOrOptions: "up" | "down" | "left" | "right" | SlideOptions = "up",
  distanceArg: number = 50,
  delayArg: number = 0,
  durationArg: number = 20
): number {
  let delay = 0;
  let duration = 20;
  let distance = 50;
  let direction: "up" | "down" | "left" | "right" = "up";

  if (typeof directionOrOptions === "string") {
    direction = directionOrOptions;
    distance = distanceArg;
    delay = delayArg;
    duration = durationArg;
  } else if (directionOrOptions) {
    delay = directionOrOptions.delay ?? 0;
    duration = directionOrOptions.duration ?? 20;
    distance = directionOrOptions.distance ?? 50;
    direction = directionOrOptions.direction ?? "up";
  }

  const progress = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const sign = direction === "up" || direction === "left" ? 1 : -1;
  return (1 - progress) * distance * sign;
}

export interface SpringScaleOptions {
  delay?: number;
  fps?: number;
  from?: number;
  to?: number;
  damping?: number;
  stiffness?: number;
  mass?: number;
}

/**
 * Spring-driven scale animation.
 * Supports options object or delay number.
 */
export function springScale(
  frame: number,
  delayOrOptions: number | SpringScaleOptions = 0,
  fpsArg: number = 30
): number {
  let delay = 0;
  let fps = fpsArg;
  let from = 0.85;
  let to = 1;
  let damping = 12;
  let stiffness = 100;
  let mass = 0.8;

  if (typeof delayOrOptions === "number") {
    delay = delayOrOptions;
  } else if (delayOrOptions) {
    delay = delayOrOptions.delay ?? 0;
    fps = delayOrOptions.fps ?? 30;
    from = delayOrOptions.from ?? 0.85;
    to = delayOrOptions.to ?? 1;
    damping = delayOrOptions.damping ?? 12;
    stiffness = delayOrOptions.stiffness ?? 100;
    mass = delayOrOptions.mass ?? 0.8;
  }

  if (frame < delay) return from;

  const spr = spring({
    frame: frame - delay,
    fps,
    config: { damping, stiffness, mass },
  });

  return interpolate(spr, [0, 1], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

/**
 * Staggers delay for arrays of elements (e.g. words, list items)
 */
export function staggerDelay(index: number, gap: number = 4, baseDelay: number = 0): number {
  return baseDelay + index * gap;
}

export interface CounterOptions {
  startFrame?: number;
  duration?: number;
  from?: number;
  to: number;
  decimals?: number;
}

/**
 * Smoothly interpolates an integer or float counter value.
 * Supports options object or positional (frame, from, to, duration, delay, decimals).
 */
export function counterValue(
  frame: number,
  fromOrOptions: number | CounterOptions = 0,
  toArg: number = 100,
  durationArg: number = 45,
  delayArg: number = 0,
  decimalsArg: number = 0
): number {
  let startFrame = 0;
  let duration = 45;
  let from = 0;
  let to = 100;
  let decimals = 0;

  if (typeof fromOrOptions === "number") {
    from = fromOrOptions;
    to = toArg;
    duration = durationArg;
    startFrame = delayArg;
    decimals = decimalsArg;
  } else if (fromOrOptions) {
    startFrame = fromOrOptions.startFrame ?? 0;
    duration = fromOrOptions.duration ?? 45;
    from = fromOrOptions.from ?? 0;
    to = fromOrOptions.to;
    decimals = fromOrOptions.decimals ?? 0;
  }

  const val = interpolate(frame, [startFrame, startFrame + duration], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return decimals === 0 ? Math.round(val) : parseFloat(val.toFixed(decimals));
}

export interface KenBurnsOptions {
  duration: number;
  scaleFrom?: number;
  scaleTo?: number;
  xFrom?: number;
  xTo?: number;
  yFrom?: number;
  yTo?: number;
}

/**
 * Computes smooth continuous Ken Burns transform (scale, translateX, translateY)
 */
export function kenBurnsTransform(frame: number, options: KenBurnsOptions) {
  const {
    duration,
    scaleFrom = 1.0,
    scaleTo = 1.15,
    xFrom = 0,
    xTo = 0,
    yFrom = 0,
    yTo = 0,
  } = options;

  const progress = interpolate(frame, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = interpolate(progress, [0, 1], [scaleFrom, scaleTo]);
  const translateX = interpolate(progress, [0, 1], [xFrom, xTo]);
  const translateY = interpolate(progress, [0, 1], [yFrom, yTo]);

  return {
    scale,
    translateX,
    translateY,
    transform: `scale(${scale.toFixed(4)}) translate3d(${translateX.toFixed(1)}px, ${translateY.toFixed(1)}px, 0)`,
  };
}

/**
 * Blur reveal transition (starts blurred and focuses)
 */
export function blurReveal(
  frame: number,
  delay: number = 0,
  duration: number = 18,
  maxBlur: number = 16
): string {
  const blur = interpolate(frame, [delay, delay + duration], [maxBlur, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return `blur(${blur.toFixed(1)}px)`;
}
