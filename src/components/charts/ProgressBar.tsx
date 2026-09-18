import React from 'react';
import { useCurrentFrame } from 'remotion';
import { interpolateValue } from '../../lib/animation/primitives';

interface ProgressBarProps {
  progress: number; // 0 to 100
  durationInFrames?: number;
  delay?: number;
  height?: number;
  color?: string;
  bgColor?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  durationInFrames = 40,
  delay = 0,
  height = 8,
  color = '#2563eb',
  bgColor = 'rgba(255, 255, 255, 0.1)',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const animatedWidth = interpolateValue(
    frame,
    [delay, delay + durationInFrames],
    [0, Math.min(100, Math.max(0, progress))],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      className={`w-full overflow-hidden rounded-full ${className}`}
      style={{ height, backgroundColor: bgColor }}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${animatedWidth}%`,
          backgroundColor: color,
        }}
      />
    </div>
  );
};
