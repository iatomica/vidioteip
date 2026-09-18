# Architecture Document — Vidioteip

## 1. System Overview

Vidioteip is a programmatic news video generation framework built on **Remotion 4.x**, **React 19**, and **TypeScript**. It transforms structured news content (JSON/TypeScript) into broadcast-ready vertical (9:16) and horizontal (16:9) MP4 videos using deterministic frame math and reusable component primitives.

```mermaid
graph TD
    A[News Story JSON / Props] --> B[Zod Schema Validation]
    B --> C[Timeline Engine (buildTimeline)]
    C --> D[NewsVideo Master Composition]
    D --> E[SceneRenderer Dispatcher]
    E --> F1[HeadlineScene]
    E --> F2[ImageScene (Ken Burns)]
    E --> F3[VideoScene]
    E --> F4[QuoteScene]
    E --> F5[StatScene]
    E --> F6[TimelineScene]
    E --> F7[ContextScene]
    E --> F8[MapScene]
    E --> F9[OutroScene]
    D --> G[TransitionWrapper (fade, slide, push, zoom, whip)]
    D --> H[SafeZoneOverlay / DebugOverlay]
    D --> I[Background Audio with automated fade]
    D --> J[Remotion Rendering Engine (H.264 MP4)]
```

---

## 2. Core Subsystems

### A. Data Layer (`src/compositions/NewsVideo/`)
- **`schema.ts`**: Zod schemas defining all scene variants, transition enums, formatting flags, audio tracks, and ticker contents.
- **`types.ts`**: TypeScript types strictly inferred from Zod schemas to ensure type-safe assembly of storyboards.
- **`defaults.ts`**: Complete default fallback values for quick testing and local verification.

### B. Timing & Sequencing Engine (`src/lib/timing/`)
- **`buildTimeline(scenes)`**: Eliminates magic numbers by sequentially stacking scenes, computing exact `startFrame`, `durationInFrames`, and `endFrame` for each Sequence.
- **`calculateTotalDuration(scenes)`**: Sums total frame duration, dynamically updating composition metadata via Remotion's `calculateMetadata`.
- **`formatTimecode(frame, fps)`**: Utility formatting frames into `MM:SS:FF` for live inspection.

### C. Deterministic Animation Primitives (`src/lib/animation/primitives.ts`)
- Every animation is a pure function of `frame`:
  - `fadeIn`, `fadeOut`: Linear or eased opacity ramps with clamping.
  - `slideIn`: Directional 2D translation offsets (up, down, left, right).
  - `springScale`: Physics-based spring animations with customizable damping and stiffness.
  - `counterValue`: Smooth numeric counting with configurable decimals.
  - `kenBurnsTransform`: Continuous scale and translation matrix for documentary-style photography.
  - `blurReveal`: Camera focus reveal effect.

### D. Design System & Theming (`src/lib/config/themes.ts`)
- Three distinct production themes:
  - **`news-modern`**: High-contrast dark navy `#0A0E1A` with electric cyan accents `#38BDF8`.
  - **`news-dark`**: Minimalist deep charcoal `#0A0A0B` with warm amber gold `#F59E0B`.
  - **`news-clean`**: Editorial light slate `#F8FAFC` with bold crimson `#E11D48`.
- Token structure covers colors, typography, borders, shadows, spacing, and platform badge hues.

### E. Responsive Layout Helpers (`src/lib/config/video.ts`)
- Single codebase targeting both formats:
  - **Vertical (9:16, 1080x1920)**: Tailored for TikTok, Instagram Reels, and YouTube Shorts with safe-margin protection.
  - **Horizontal (16:9, 1920x1080)**: Tailored for YouTube, broadcast monitors, and websites.
- `useResponsive()` provides real-time format detection, normalized scale multipliers, and platform UI safe zones.

---

## 3. Scene Library

| Scene Type | Component | Purpose | Key Sub-components |
|---|---|---|---|
| `headline` | `HeadlineScene` | Opening hook & breaking report title | `Headline`, `Subheadline`, `Kicker`, `LiveBadge`, `NewsTicker` |
| `image` | `ImageScene` | Photo analysis with Ken Burns zoom/pan | `KenBurnsImage`, `LowerThird`, `SourcePill` |
| `video` | `VideoScene` | Background footage with overlay | `BackgroundVideo`, `LowerThird`, `SourcePill` |
| `quote` | `QuoteScene` | Official statement or expert reaction | `Quote`, `SourcePill`, `BokehCircles` |
| `stat` | `StatScene` | Key metric, percentage, or currency | `NumberStat`, `StatCounter`, `GridPulse` |
| `timeline` | `TimelineScene` | Step-by-step chronology of developing news | Animated dot indicators, step cards |
| `context` | `ContextScene` | Key takeaways or bulleted facts | Staggered takeaway cards |
| `map` | `MapScene` | Location HUD with coordinates & radar | Animated SVG radar scan, target reticle |
| `outro` | `OutroScene` | Channel branding, CTA, social handles | Brand badge, social handle pills |
