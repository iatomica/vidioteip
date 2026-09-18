import React from 'react';
import { useCurrentFrame } from 'remotion';
import { counterValue } from '../../lib/animation/primitives';

interface StatCounterProps {
  value: number;
  durationInFrames?: number;
  delay?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const StatCounter: React.FC<StatCounterProps> = ({
  value,
  durationInFrames = 45,
  delay = 0,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const animatedVal = counterValue(frame, 0, value, durationInFrames, delay, decimals);

  return (
    <span className={`inline-block font-mono tracking-tight ${className}`} style={style}>
      {prefix}
      {animatedVal.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
};
