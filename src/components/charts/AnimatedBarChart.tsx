import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { ThemeTokens } from "../../lib/config/themes";

export interface BarDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface AnimatedBarChartProps {
  data: BarDataPoint[];
  theme: ThemeTokens;
  maxValue?: number;
  height?: number;
  delay?: number;
}

export function AnimatedBarChart({
  data,
  theme,
  maxValue,
  height = 240,
  delay = 10,
}: AnimatedBarChartProps) {
  const frame = useCurrentFrame();
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 16,
        height,
        width: "100%",
        padding: "16px 0",
        borderBottom: `2px solid ${theme.surfaceBorder}`,
      }}
    >
      {data.map((item, idx) => {
        const itemDelay = delay + idx * 4;
        const progress = interpolate(frame, [itemDelay, itemDelay + 25], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const barHeight = (item.value / max) * (height - 50) * progress;

        return (
          <div
            key={idx}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            {/* Value indicator */}
            <span
              style={{
                fontFamily: theme.fontFamily,
                fontSize: 14,
                fontWeight: 700,
                color: theme.accent,
                opacity: progress,
              }}
            >
              {Math.round(item.value * progress)}
            </span>

            {/* Visual bar */}
            <div
              style={{
                width: "100%",
                maxWidth: 48,
                height: Math.max(4, barHeight),
                backgroundColor: item.color || theme.accent,
                borderRadius: `${theme.borderRadius.sm} ${theme.borderRadius.sm} 0 0`,
                boxShadow: `0 0 15px ${item.color || theme.accent}44`,
              }}
            />

            {/* Label */}
            <span
              style={{
                fontFamily: theme.fontFamily,
                fontSize: 12,
                color: theme.foregroundMuted,
                textAlign: "center",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "100%",
              }}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
