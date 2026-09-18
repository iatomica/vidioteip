# Third-Party Code & Template Attribution (`THIRD_PARTY.md`)

This document records the open-source projects, templates, and libraries referenced or adapted in Vidioteip, in compliance with open-source licensing and attribution rules.

---

## 1. Remotion Templates (React Video Editor)

- **Source Repository:** [https://github.com/reactvideoeditor/remotion-templates](https://github.com/reactvideoeditor/remotion-templates)
- **License:** MIT License (Copyright (c) 2024 React Video Editor)
- **Adapted Patterns & Modules:**
  1. **Ken Burns Motion Math:** Adapted into `src/lib/animation/primitives.ts` (`kenBurnsTransform`) and `src/components/media/KenBurnsImage.tsx`. Extracted pure mathematical interpolation without importing heavy third-party viewport helpers.
  2. **Bokeh Circles & Ambient Particles:** Adapted into `src/components/backgrounds/BokehCircles.tsx` using sinusoidal frame oscillations and CSS blur filters.
  3. **Transition Sequences:** Inspired the structure of `src/components/transitions/TransitionWrapper.tsx` (`fade`, `fade-through-black`, `slide`, `push`, `zoom`, `whip`).
  4. **Animated SVG Charts:** Mathematical path calculation for `src/components/charts/AnimatedBarChart.tsx` and `src/components/charts/AnimatedLineChart.tsx` without adding D3 or external chart bundles.

---

## 2. Locomotion

- **Source Repository:** [https://github.com/locomotion-pro/locomotion](https://github.com/locomotion-pro/locomotion)
- **License:** MIT License
- **Reference Patterns:**
  - Dynamic aspect-ratio responsive calculations adapted in `src/lib/config/video.ts` (`useResponsive`).
  - Mobile platform safe-area offset heuristics (TikTok right-rail button margin and bottom caption zone).

---

## 3. P0 Animations

- **Source Repository:** [https://github.com/0dotxyz/p0-animations](https://github.com/0dotxyz/p0-animations)
- **License:** MIT License
- **Reference Patterns:**
  - Deterministic spring-scale physics presets in `src/lib/animation/primitives.ts`.
  - Staggered word and character animation timing in `src/components/text/Headline.tsx`.

---

## 4. Dependencies Rationale & Weight Control

To ensure zero cost and fast CPU rendering on modest VPS hardware (2–4 vCPU, 4–8 GB RAM), we intentionally avoided:
- **Three.js / WebGL:** Substituted with lightweight SVG vector graphics and CSS transforms.
- **Chart.js / D3:** Substituted with native SVG `<polyline>` and `<rect>` elements animated with Remotion `interpolate()`.
- **Heavy Animation Libraries (Framer Motion / GSAP):** Substituted with Remotion's native deterministic `spring()` and `interpolate()`.
