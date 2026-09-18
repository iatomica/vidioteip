import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { ThemeTokens } from "../../lib/config/themes";

export interface LineDataPoint {
  label: string;
  value: number;
}

interface AnimatedLineChartProps {
  data: LineDataPoint[];
  theme: ThemeTokens;
  height?: number;
  delay?: number;
}

export function AnimatedLineChart({
  data,
  theme,
  height = 200,
  delay = 10,
}: AnimatedLineChartProps) {
  const frame = useCurrentFrame();

  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const minVal = Math.min(...data.map((d) => d.value), 0);
  const range = maxVal - minVal || 1;

  const progress = interpolate(frame, [delay, delay + 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const width = 600;
  const padding = 40;
  const graphWidth = width - padding * 2;
  const graphHeight = height - padding * 2;

  const points = data.map((d, idx) => {
    const x = padding + (idx / (data.length - 1 || 1)) * graphWidth;
    const y = height - padding - ((d.value - minVal) / range) * graphHeight;
    return { x, y };
  });

  const pointsString = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div style={{ width: "100%", maxWidth: width }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: "100%", height: "auto", overflow: "visible" }}
      >
        {/* Baseline */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke={theme.surfaceBorder}
          strokeWidth="2"
        />

        {/* Animated Polyline */}
        <polyline
          fill="none"
          stroke={theme.accent}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={pointsString}
          strokeDasharray="1000"
          strokeDashoffset={1000 * (1 - progress)}
          style={{
            filter: `drop-shadow(0 0 10px ${theme.accent}88)`,
          }}
        />

        {/* Data points */}
        {points.map((p, idx) => {
          const ptDelay = delay + idx * 4;
          const ptOpacity = interpolate(frame, [ptDelay, ptDelay + 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <circle
              key={idx}
              cx={p.x}
              cy={p.y}
              r={5}
              fill={theme.background}
              stroke={theme.accent}
              strokeWidth="3"
              opacity={ptOpacity}
            />
          );
        })}
      </svg>
    </div>
  );
}
