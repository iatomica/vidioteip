import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { formatTimecode } from "../../lib/timing/timeline";
import { Scene } from "../../compositions/NewsVideo/types";

export interface DebugOverlayProps {
  show?: boolean;
  activeScene?: Scene | string;
  themeName?: string;
}

export function DebugOverlay({
  show = false,
  activeScene,
  themeName = "news-modern",
}: DebugOverlayProps) {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();

  if (!show) return null;

  const sceneLabel =
    typeof activeScene === "string"
      ? activeScene
      : activeScene
      ? `${activeScene.type} (${activeScene.id})`
      : "None";

  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        left: 20,
        zIndex: 9999,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: 8,
        padding: "10px 14px",
        color: "#38BDF8",
        fontFamily: "monospace",
        fontSize: 13,
        lineHeight: 1.4,
        pointerEvents: "none",
        boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ color: "#F59E0B", fontWeight: 700, marginBottom: 4 }}>
        [DEBUG HUD]
      </div>
      <div>FRAME: {frame} / {durationInFrames}</div>
      <div>TC: {formatTimecode(frame, fps)}</div>
      <div>RES: {width}x{height} @ {fps}fps</div>
      <div>RATIO: {width > height ? "16:9" : "9:16"}</div>
      <div>SCENE: {sceneLabel}</div>
      <div>THEME: {themeName}</div>
    </div>
  );
}
