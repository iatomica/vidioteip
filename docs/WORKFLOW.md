# Workflow Guide — From News Article to MP4 Video

This guide describes the complete end-to-end editorial pipeline for generating programmatic news videos with Vidioteip.

```
ARTICLE
   ↓
SCRIPT
   ↓
STORYBOARD
   ↓
ASSETS
   ↓
SCENE CONFIG
   ↓
REMOTION
   ↓
PREVIEW
   ↓
RENDER
```

---

## Stage 1: ARTICLE (Raw Input)
- **Input:** Wire report, journalist brief, press release, or scientific paper.
- **Objective:** Identify the core premise, the central figure or discovery, the critical metric or statistic, and the geographical location.

---

## Stage 2: SCRIPT (Editorial Writing)
Condense the article into concise video micro-copy:
- **Hook (0-4s):** High-impact 6-8 word headline that demands attention.
- **Context (4-8s):** Where and when this took place.
- **Proof / Metric (8-12s):** Concrete number or percentage backing up the story.
- **Quote (12-16s):** Primary source statement.
- **Key Points (16-20s):** 3-4 bullet takeaways.
- **CTA (20-23s):** Outro directing viewers to follow or read more.

---

## Stage 3: STORYBOARD (Scene Sequence)
Map each script beat to a scene type in our library:

| Beat # | Scene Type | Recommended Duration | Visual Focus |
|---|---|---|---|
| Beat 1 | `headline` | 120 frames (4.0s) | Bold animated title, breaking kicker, live badge |
| Beat 2 | `map` | 105 frames (3.5s) | Coordinates HUD, radar sweep, location name |
| Beat 3 | `stat` | 120 frames (4.0s) | Animated counter, unit suffix, comparison context |
| Beat 4 | `quote` | 120 frames (4.0s) | Pull quote, author attribution, role |
| Beat 5 | `context` | 135 frames (4.5s) | Staggered cards for key points |
| Beat 6 | `outro` | 90 frames (3.0s) | Channel badge, call to action, social handles |

---

## Stage 4: ASSETS (Media Collection)
- Download relevant high-resolution imagery or B-roll footage.
- Place local files in `public/assets/images/` or `public/assets/video/`.
- Ensure all media is royalty-free, Creative Commons, Wikimedia, or properly licensed.
- Local static assets are loaded via `resolveAsset("images/my-photo.jpg")`.
- If no media file is available, our SVG procedural generator produces an animated gradient fallback automatically.

---

## Stage 5: SCENE CONFIG (JSON / TypeScript)
Assemble the complete configuration object conforming to `NewsVideoSchema`:
```typescript
import { NewsVideoProps } from '@/compositions/NewsVideo/types';

export const myStory: NewsVideoProps = {
  title: "...",
  theme: "news-modern",
  format: "vertical",
  scenes: [
    { id: "s1", type: "headline", durationInFrames: 120, content: { ... } },
    { id: "s2", type: "map", durationInFrames: 105, content: { ... } },
    // ...
  ]
};
```

---

## Stage 6: REMOTION (Composition Assembly)
- Pass the config to `<NewsVideo>` in `src/Root.tsx`.
- The composition automatically sequences all scenes using `buildTimeline(scenes)`.
- Transitions (fade, slide, push, zoom, whip) are applied automatically between adjacent sequences.
- Dynamic duration is calculated by `calculateMetadata`.

---

## Stage 7: PREVIEW (Remotion Studio)
```bash
npm run dev
```
1. Open `http://localhost:3000` in the browser.
2. Select `NewsVertical` or `NewsHorizontal`.
3. Scrub through the timeline frame by frame.
4. Toggle `showSafeAreas=true` to ensure subtitles and headlines remain visible on TikTok/Reels UI.
5. Toggle `debug=true` to verify timecodes, FPS, and active scene IDs.

---

## Stage 8: RENDER (MP4 Production)
```bash
# Vertical render (1080x1920)
npm run render:vertical

# Horizontal render (1920x1080)
npm run render:horizontal
```
- Remotion spins up headless Chromium and stitches frames with FFmpeg.
- The completed video is exported to `out/news-vertical.mp4` or `out/news-horizontal.mp4` with H.264 video and AAC audio.
