import React from "react";
import { useResponsive } from "../../lib/config/video";

interface SafeZoneOverlayProps {
  show?: boolean;
}

export function SafeZoneOverlay({ show = false }: SafeZoneOverlayProps) {
  const { safeArea, isVertical } = useResponsive();

  if (!show || !isVertical) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9990,
      }}
    >
      {/* Top Margin (Search header & notch) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: safeArea.top,
          backgroundColor: "rgba(239, 68, 68, 0.15)",
          borderBottom: "1px dashed rgba(239, 68, 68, 0.7)",
          display: "flex",
          alignItems: "flex-end",
          padding: "4px 8px",
          color: "#EF4444",
          fontSize: 11,
          fontFamily: "monospace",
        }}
      >
        TOP PLATFORM HEADER ZONE (~{safeArea.top}px)
      </div>

      {/* Bottom Margin (Captions, Audio pill & Comment box) */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: safeArea.bottom,
          backgroundColor: "rgba(239, 68, 68, 0.15)",
          borderTop: "1px dashed rgba(239, 68, 68, 0.7)",
          display: "flex",
          alignItems: "flex-start",
          padding: "4px 8px",
          color: "#EF4444",
          fontSize: 11,
          fontFamily: "monospace",
        }}
      >
        BOTTOM CAPTION & INTERACTION ZONE (~{safeArea.bottom}px)
      </div>

      {/* Right Margin (Like, Share, Profile buttons) */}
      <div
        style={{
          position: "absolute",
          top: safeArea.top,
          bottom: safeArea.bottom,
          right: 0,
          width: safeArea.right,
          backgroundColor: "rgba(239, 68, 68, 0.12)",
          borderLeft: "1px dashed rgba(239, 68, 68, 0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#EF4444",
          fontSize: 11,
          fontFamily: "monospace",
          writingMode: "vertical-rl",
        }}
      >
        ACTION RAIL (~{safeArea.right}px)
      </div>
    </div>
  );
}
