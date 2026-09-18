import React from 'react';

interface NoiseGrainProps {
  opacity?: number;
  blendMode?: 'overlay' | 'screen' | 'multiply' | 'soft-light';
}

export const NoiseGrain: React.FC<NoiseGrainProps> = ({
  opacity = 0.04,
  blendMode = 'overlay',
}) => {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
      style={{
        opacity,
        mixBlendMode: blendMode,
      }}
    >
      <svg className="h-full w-full">
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
};
