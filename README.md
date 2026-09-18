# Vidioteip (Programmatic News Video Framework)

A reusable, configuration-driven platform for generating broadcast-quality news videos using **Remotion 4.x**, **React 19**, and **TypeScript**.

Supports dual output formats from a shared codebase:
- **Vertical Social Video (9:16, 1080x1920 @ 30fps)** for TikTok, Instagram Reels, and YouTube Shorts.
- **Horizontal Broadcast Video (16:9, 1920x1080 @ 30fps)** for YouTube and web broadcasts.

---

## Requirements

- **Node.js**: 20 LTS or higher
- **npm**: 10+
- **Hardware**: Runs smoothly on standard CPU (2–4 vCPU, 4–8 GB RAM). No GPU required.
- **FFmpeg & Chromium**: Handled automatically by Remotion / Puppeteer.

---

## Installation

```bash
git clone <repo-url>
cd vidioteip
npm install
```

---

## Development & Studio Preview

Launch Remotion Studio to interactively preview compositions, scrub frame-by-frame, and inspect safe zones:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

- Select `NewsVertical` or `NewsHorizontal` in the left sidebar.
- Edit props in the Studio sidebar in real-time without modifying code.
- Toggle `showSafeAreas=true` to preview TikTok / Reels UI boundary cutoffs.
- Toggle `debug=true` for a live HUD overlay showing active scene, frame counter, and timecode.

---

## Rendering MP4 Videos

Render locally or on a headless VPS (outputs to `/out` as H.264 MP4):

```bash
# Render 9:16 Vertical Video (TikTok / Reels / Shorts)
npm run render:vertical

# Render 16:9 Horizontal Video (YouTube / Web)
npm run render:horizontal

# Custom slice rendering (e.g. frames 0 to 60)
npm run render:vertical -- --frames=0-60
```

---

## Code Quality & Type Checking

```bash
# TypeScript strict typecheck (zero errors)
npm run typecheck

# ESLint audit
npm run lint

# Prettier format
npm run format
```

---

## Repository Structure

```
src/
├── compositions/
│   └── NewsVideo/
│       ├── NewsVideo.tsx      # Master orchestrator sequence composition
│       ├── schema.ts         # Zod schemas for storyboards and scenes
│       ├── types.ts          # Strongly-typed models inferred from schemas
│       └── defaults.ts       # Production fallback fixtures
├── scenes/
│   ├── HeadlineScene/        # Breaking title, kicker, live badge, ticker
│   ├── ImageScene/           # Photo analysis with Ken Burns zoom/pan
│   ├── VideoScene/           # Video background footage with caption
│   ├── QuoteScene/           # Editorial quote card with author and role
│   ├── StatScene/            # Animated numeric counter with comparison
│   ├── TimelineScene/        # Step-by-step chronological progression
│   ├── ContextScene/         # 3-4 bulleted key takeaway cards
│   ├── MapScene/             # Geographic coordinate radar & location HUD
│   ├── OutroScene/           # Brand badge, CTA, and social channels
│   └── SceneRenderer.tsx     # Polymorphic dispatcher mapping scene.type -> Scene
├── components/
│   ├── backgrounds/          # GradientBackground, BokehCircles, GridPulse, NoiseGrain
│   ├── branding/             # LiveBadge, SourcePill, NewsTicker
│   ├── charts/               # AnimatedBarChart, AnimatedLineChart, StatCounter, ProgressBar
│   ├── media/                # ResponsiveImage, KenBurnsImage, BackgroundVideo
│   ├── overlays/             # DebugOverlay (Live HUD for frame, timecode & scene)
│   ├── safe-areas/           # SafeZoneOverlay (TikTok/Reels UI boundaries)
│   ├── text/                 # Headline, Subheadline, Kicker, LowerThird, Quote, NumberStat
│   └── transitions/          # TransitionWrapper (fade, slide, push, zoom, whip)
├── lib/
│   ├── animation/            # Deterministic primitives: fadeIn, slideIn, springScale, counterValue
│   ├── config/               # themes.ts (news-modern, news-dark, news-clean), video.ts
│   ├── media/                # resolveAsset() utility (local staticFile & SVG fallback)
│   └── timing/               # buildTimeline(), calculateTotalDuration(), formatTimecode()
├── data/
│   └── example-news.ts       # Fixture news story used for test renders
├── Root.tsx                  # Registers NewsVertical & NewsHorizontal
└── index.ts                  # Remotion registerRoot entrypoint
```

---

## How to Generate a New Video

1. Open or create a configuration object conforming to `NewsVideoSchema` (see `src/data/example-news.ts`).
2. Define the scenes array (e.g. `headline` → `map` → `stat` → `quote` → `context` → `outro`).
3. Place visual assets (if any) in `public/assets/images/` or `public/assets/video/`.
4. Point `<NewsVideo>` to your config in `Root.tsx` or inject props via CLI.
5. Execute `npm run render:vertical` or `npm run render:horizontal`.

See [`docs/WORKFLOW.md`](file:///c:/Users/manua/OneDrive/Documents/Repos/vidioteip/docs/WORKFLOW.md) and [`AGENTS.md`](file:///c:/Users/manua/OneDrive/Documents/Repos/vidioteip/AGENTS.md) for full details.

---

## Adding Assets

- **Images**: Save to `public/assets/images/filename.jpg`. In scene configuration, set `src: "images/filename.jpg"`.
- **Videos**: Save to `public/assets/video/clip.mp4`. In scene configuration, set `src: "video/clip.mp4"`.
- **Audio**: Save to `public/assets/audio/music.mp3`. Set `audio: { src: "audio/music.mp3", volume: 0.3 }`.
- **Fallback**: If an image is missing or omitted, `resolveAsset()` automatically renders a themed SVG gradient placeholder.

---

## Docker Deployment (Headless VPS)

Build and run on any Linux VPS with zero GUI dependencies:

```bash
# Build docker image
docker build -t vidioteip .

# Render MP4 inside container and mount output to local ./out directory
docker run --rm -v $(pwd)/out:/app/out vidioteip
```

---

## Open-Source Attribution & Licenses

This project incorporates and adapts motion math and animation patterns from MIT-licensed open-source Remotion projects (`reactvideoeditor/remotion-templates`, `locomotion-pro/locomotion`, `0dotxyz/p0-animations`). See [`docs/THIRD_PARTY.md`](file:///c:/Users/manua/OneDrive/Documents/Repos/vidioteip/docs/THIRD_PARTY.md) for full licensing details.
