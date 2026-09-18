# AGENTS.md — AI Coding Agent Guide for Vidioteip

Welcome, Agent. This guide explains how to generate, configure, and render programmatic news videos in this repository using Remotion, React, and TypeScript.

---

## 1. Project Philosophy & Operating Principles

1. **Config-Driven Production:** Never hardcode news text or story content into UI components. Every video is created by assembling a `NewsVideoProps` configuration object (JSON or TypeScript) passed to `<NewsVideo>`.
2. **Reuse Before Creating:**
   - **FIRST:** Check existing components in `src/components/` and scenes in `src/scenes/`.
   - **SECOND:** Check open-source templates or patterns adapted in `src/templates/` (documented in `docs/THIRD_PARTY.md`).
   - **THIRD:** Only create a new component if none of the existing building blocks fit the editorial need.
3. **Deterministic Frame Math:**
   - Always use `useCurrentFrame()`, `interpolate()`, and `spring()` from Remotion or our primitives in `src/lib/animation/primitives.ts`.
   - **NEVER** use `setTimeout`, `setInterval`, `requestAnimationFrame`, or native CSS `@keyframes`/`transition` for render-critical animations.
4. **Zero-Paid External Services:**
   - Everything runs 100% locally or on a standard CPU VPS (2–4 vCPU, 4–8 GB RAM).
   - Never introduce paid APIs (e.g. OpenAI, ElevenLabs) into the core video rendering pipeline without explicit instructions.

---

## 2. Directory Architecture

```
vidioteip/
├── src/
│   ├── compositions/
│   │   └── NewsVideo/
│   │       ├── NewsVideo.tsx      # Master orchestrator composition
│   │       ├── schema.ts         # Zod validation schema
│   │       ├── types.ts          # TypeScript types inferred from schema
│   │       └── defaults.ts       # Fallback mock props
│   ├── scenes/
│   │   ├── HeadlineScene/        # Breaking title, kicker, live badge, ticker
│   │   ├── ImageScene/           # Photo with smooth Ken Burns pan/zoom
│   │   ├── VideoScene/           # Background video clip with overlay & caption
│   │   ├── QuoteScene/           # Editorial quote card with avatar & role
│   │   ├── StatScene/            # Animated numeric counter & comparative metric
│   │   ├── TimelineScene/        # Step-by-step chronological progression
│   │   ├── ContextScene/         # 3-4 bulleted key takeaway cards
│   │   ├── MapScene/             # Geographic coordinate radar & location HUD
│   │   ├── OutroScene/           # Brand badge, CTA, and social channels
│   │   └── SceneRenderer.tsx     # Polymorphic dispatcher mapping scene.type -> Scene
│   ├── components/
│   │   ├── backgrounds/          # GradientBackground, BokehCircles, GridPulse, NoiseGrain
│   │   ├── branding/             # LiveBadge, SourcePill, NewsTicker
│   │   ├── charts/               # AnimatedBarChart, AnimatedLineChart, StatCounter, ProgressBar
│   │   ├── media/                # ResponsiveImage, KenBurnsImage, BackgroundVideo
│   │   ├── overlays/             # DebugOverlay (Live HUD for frame, timecode & scene)
│   │   ├── safe-areas/           # SafeZoneOverlay (TikTok/Reels UI boundaries)
│   │   ├── text/                 # Headline, Subheadline, Kicker, LowerThird, Quote, NumberStat
│   │   └── transitions/          # TransitionWrapper (fade, slide, push, zoom, whip)
│   ├── lib/
│   │   ├── animation/
│   │   │   └── primitives.ts     # fadeIn, fadeOut, slideIn, springScale, counterValue, kenBurnsTransform
│   │   ├── config/
│   │   │   ├── themes.ts         # Design tokens: news-modern, news-dark, news-clean
│   │   │   └── video.ts          # Vertical (9:16) & Horizontal (16:9) configs, useResponsive()
│   │   ├── media/
│   │   │   └── assets.ts         # resolveAsset() utility (local staticFile & SVG fallback)
│   │   └── timing/
│   │       └── timeline.ts       # buildTimeline(), calculateTotalDuration(), formatTimecode()
│   ├── data/
│   │   └── example-news.ts       # Fixture news story used for test renders
│   ├── Root.tsx                  # Registers NewsVertical & NewsHorizontal compositions
│   └── index.ts                  # Remotion entrypoint (registerRoot)
├── public/
│   └── assets/                   # Local images, audio, video, logos
├── out/                          # Git-ignored destination for rendered MP4s
├── docs/                         # ARCHITECTURE.md, WORKFLOW.md, THIRD_PARTY.md
├── Dockerfile                    # Headless Linux VPS rendering container
└── remotion.config.ts            # H.264 MP4 codec, Rspack bundler
```

---

## 3. How to Create a News Video (Future Routine)

When given a news brief or article, execute these steps:

### Step 1: Extract Storyboard & Beats
Break the article into 4 to 7 coherent scenes:
1. **Headline:** Punchy title (max 8-10 words) + kicker + subtitle.
2. **Location / Context:** Map coordinates or context key points.
3. **Core Data / Proof:** Stat counter or timeline progression.
4. **Expert Reaction:** Quote from a primary source or official.
5. **Outro:** CTA to follow, subscribe, or read full article.

### Step 2: Prepare Assets
- Place imagery or video in `public/assets/images/` or `public/assets/video/`.
- Reference them in scene configs as `"images/my-photo.jpg"` (automatically resolved via `resolveAsset()` with `staticFile()`).
- If no image is supplied, omit `src` or leave blank—the engine provides SVG animated placeholders automatically.

### Step 3: Define Video JSON Configuration
Create a config object matching `NewsVideoSchema`:
```typescript
import { NewsVideoProps } from '@/compositions/NewsVideo/types';

export const breakingStory: NewsVideoProps = {
  title: "Historic Fusion Energy Record Achieved",
  source: "ENERGY OBSERVER",
  theme: "news-modern", // or "news-dark" | "news-clean"
  format: "vertical",    // or "horizontal"
  scenes: [
    {
      id: "beat-1",
      type: "headline",
      durationInFrames: 120, // 4s at 30fps
      transition: "fade",
      content: {
        kicker: "ENERGY BREAKTHROUGH",
        title: "Net Energy Gain Exceeds 200%",
        subtitle: "Reaction sustained for 32 consecutive minutes.",
      },
    },
    {
      id: "beat-2",
      type: "stat",
      durationInFrames: 120,
      transition: "zoom",
      content: {
        kicker: "OUTPUT METRIC",
        value: 3.15,
        decimals: 2,
        suffix: " MJ",
        label: "Peak Thermal Output",
        comparison: "Previous global maximum was 1.35 MJ",
      },
    },
    {
      id: "beat-3",
      type: "outro",
      durationInFrames: 90,
      transition: "fade",
      content: {
        title: "STAY INFORMED",
        callToAction: "Follow for real-time science updates",
      },
    },
  ],
};
```

### Step 4: Preview in Studio
```bash
npm run dev
```
Open `http://localhost:3000` to preview in real-time. Enable `debug={true}` or `showSafeAreas={true}` in props to inspect alignment.

### Step 5: Render to MP4
```bash
# Render vertical (1080x1920, 9:16)
npm run render:vertical

# Render horizontal (1920x1080, 16:9)
npm run render:horizontal
```
The output file is written to `out/news-vertical.mp4` or `out/news-horizontal.mp4`.

---

## 4. Animation & Timing Guidelines

1. **Calculate Timelines Automatically:**
   Always use `buildTimeline(scenes)`:
   ```typescript
   const timeline = buildTimeline(scenes);
   // Returns array with: { scene, startFrame, durationInFrames, endFrame }
   ```
2. **Use Animation Primitives:**
   Import from `src/lib/animation/primitives.ts`:
   - `fadeIn(frame, delay, duration)`
   - `slideIn(frame, direction, distance, delay, duration)`
   - `springScale(frame, delay)`
   - `counterValue(frame, from, to, duration, delay, decimals)`
   - `kenBurnsTransform(frame, options)`
   - `blurReveal(frame, delay, duration)`
3. **Safe Areas for Vertical Video:**
   - Top 12% (~230px) is reserved for TikTok/Reels search headers.
   - Bottom 16% (~300px) is reserved for captions and audio ticker.
   - Right 18% (~190px) is reserved for platform action buttons (Like, Share).
   - Use `useResponsive()` to retrieve `{ safeArea, isVertical, isHorizontal }`.

---

## 5. Themes & Design Tokens

Available themes:
- `news-modern`: Deep navy `#0A0E1A`, electric cyan accent `#38BDF8`, high contrast.
- `news-dark`: Pitch black `#0A0A0B`, warm amber gold accent `#F59E0B`, editorial tone.
- `news-clean`: Crisp slate `#F8FAFC`, crimson accent `#E11D48`, corporate/documentary.

Call `useTheme(themeName)` to get full tokens (`colors`, `typography`, `shadows`, `borderRadius`, `spacing`).

---

## 6. Commands Reference (Windows Environment Note)

On this system, execute commands via Node directly:
```bash
# Typecheck
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run typecheck

# Lint
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run lint

# Remotion Studio
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run dev

# Render
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run render:vertical
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run render:horizontal
```
