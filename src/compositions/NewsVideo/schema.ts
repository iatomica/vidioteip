import { z } from "zod";

export const TransitionTypeSchema = z.enum([
  "wipe-snap",
  "crash-zoom",
  "elastic-slide",
  "flash-cut",
  "fade",
  "fade-through-black",
  "slide",
  "push",
  "zoom",
  "whip",
  "none",
]);

export type TransitionType = z.infer<typeof TransitionTypeSchema>;

export const ThemeNameSchema = z.enum([
  "editorial-calm",
  "vox-editorial",
  "news-modern",
  "news-dark",
  "news-clean",
]);

const DurationField = z.number().positive().default(120);

// 1. Headline Scene
export const HeadlineSceneSchema = z.object({
  id: z.string(),
  type: z.literal("headline"),
  durationInFrames: DurationField,
  duration: z.number().positive().optional(),
  transition: TransitionTypeSchema.default("wipe-snap"),
  theme: ThemeNameSchema.optional(),
  content: z.object({
    kicker: z.string().default("BREAKING NEWS"),
    title: z.string(),
    subtitle: z.string().optional(),
    badgeText: z.string().default("SPECIAL REPORT"),
    source: z.string().optional(),
    date: z.string().optional(),
    backgroundImage: z.string().optional(),
    tickerItems: z.array(z.string()).optional(),
    templateId: z.string().optional(),
    themeMode: z.enum(["dark", "light"]).optional(),
  }),
});

// 2. Image Scene (with Ken Burns)
export const ImageSceneSchema = z.object({
  id: z.string(),
  type: z.literal("image"),
  durationInFrames: DurationField,
  duration: z.number().positive().optional(),
  transition: TransitionTypeSchema.default("wipe-snap"),
  theme: ThemeNameSchema.optional(),
  content: z.object({
    src: z.string(),
    alt: z.string().optional(),
    caption: z.string().optional(),
    source: z.string().optional(),
    scaleFrom: z.number().default(1.0),
    scaleTo: z.number().default(1.15),
    xFrom: z.number().default(0),
    xTo: z.number().default(0),
    yFrom: z.number().default(0),
    yTo: z.number().default(0),
    overlay: z.boolean().optional().default(true),
  }),
});

// 3. Video Scene
export const VideoSceneSchema = z.object({
  id: z.string(),
  type: z.literal("video"),
  durationInFrames: DurationField,
  duration: z.number().positive().optional(),
  transition: TransitionTypeSchema.default("wipe-snap"),
  theme: ThemeNameSchema.optional(),
  content: z.object({
    src: z.string(),
    caption: z.string().optional(),
    source: z.string().optional(),
    muted: z.boolean().optional().default(true),
    playbackRate: z.number().optional().default(1.0),
    overlay: z.boolean().optional().default(true),
  }),
});

// 4. Quote Scene
export const QuoteSceneSchema = z.object({
  id: z.string(),
  type: z.literal("quote"),
  durationInFrames: DurationField,
  duration: z.number().positive().optional(),
  transition: TransitionTypeSchema.default("flash-cut"),
  theme: ThemeNameSchema.optional(),
  content: z.object({
    quote: z.string(),
    author: z.string(),
    role: z.string().optional(),
    authorAvatar: z.string().optional(),
    source: z.string().optional(),
  }),
});

// 5. Stat Scene
export const StatSceneSchema = z.object({
  id: z.string(),
  type: z.literal("stat"),
  durationInFrames: DurationField,
  duration: z.number().positive().optional(),
  transition: TransitionTypeSchema.default("crash-zoom"),
  theme: ThemeNameSchema.optional(),
  content: z.object({
    kicker: z.string().optional(),
    numberValue: z.number().optional(),
    value: z.number().optional(),
    numberPrefix: z.string().optional(),
    prefix: z.string().optional(),
    numberSuffix: z.string().optional(),
    suffix: z.string().optional(),
    decimals: z.number().optional(),
    label: z.string(),
    context: z.string().optional(),
    comparison: z.string().optional(),
  }),
});

// 6. Timeline Scene
export const TimelineSceneSchema = z.object({
  id: z.string(),
  type: z.literal("timeline"),
  durationInFrames: DurationField,
  duration: z.number().positive().optional(),
  transition: TransitionTypeSchema.default("elastic-slide"),
  theme: ThemeNameSchema.optional(),
  content: z.object({
    kicker: z.string().optional(),
    title: z.string(),
    steps: z.array(
      z.object({
        time: z.string(),
        label: z.string(),
        description: z.string().optional(),
      })
    ),
  }),
});

// 7. Context Scene
export const ContextSceneSchema = z.object({
  id: z.string(),
  type: z.literal("context"),
  durationInFrames: DurationField,
  duration: z.number().positive().optional(),
  transition: TransitionTypeSchema.default("wipe-snap"),
  theme: ThemeNameSchema.optional(),
  content: z.object({
    kicker: z.string().optional(),
    title: z.string(),
    subtitle: z.string().optional(),
    points: z.array(z.string()),
  }),
});

// 8. Map Scene
export const MapSceneSchema = z.object({
  id: z.string(),
  type: z.literal("map"),
  durationInFrames: DurationField,
  duration: z.number().positive().optional(),
  transition: TransitionTypeSchema.default("crash-zoom"),
  theme: ThemeNameSchema.optional(),
  content: z.object({
    kicker: z.string().optional(),
    location: z.string().optional(),
    locationName: z.string().optional(),
    coordinates: z.string().optional(),
    region: z.string().optional(),
    description: z.string().optional(),
    context: z.string().optional(),
  }),
});

// 9. Outro Scene
export const OutroSceneSchema = z.object({
  id: z.string(),
  type: z.literal("outro"),
  durationInFrames: DurationField,
  duration: z.number().positive().optional(),
  transition: TransitionTypeSchema.default("wipe-snap"),
  theme: ThemeNameSchema.optional(),
  content: z.object({
    title: z.string().default("STAY INFORMED"),
    callToAction: z.string().default("Follow for breaking news updates"),
    channelName: z.string().optional(),
    website: z.string().optional(),
    socialHandles: z.array(z.string()).optional(),
    handles: z
      .array(
        z.object({
          platform: z.string(),
          handle: z.string(),
        })
      )
      .optional(),
  }),
});

// Discriminated Scene Union
export const SceneSchema = z.discriminatedUnion("type", [
  HeadlineSceneSchema,
  ImageSceneSchema,
  VideoSceneSchema,
  QuoteSceneSchema,
  StatSceneSchema,
  TimelineSceneSchema,
  ContextSceneSchema,
  MapSceneSchema,
  OutroSceneSchema,
]);

export type Scene = z.infer<typeof SceneSchema>;

// Root News Video Schema
export const NewsVideoSchema = z.object({
  title: z.string().default("Breaking News Story"),
  subtitle: z.string().optional(),
  source: z.string().default("GLOBAL NEWS NETWORK"),
  date: z.string().optional(),
  topic: z.string().optional(),
  theme: ThemeNameSchema.default("vox-editorial"),
  format: z.enum(["vertical", "horizontal"]).default("vertical"),
  durationInFrames: z.number().optional(),
  duration: z.number().optional(),
  showSafeAreas: z.boolean().default(false),
  debug: z.boolean().default(false),
  tickerItems: z.array(z.string()).optional(),
  audio: z
    .object({
      src: z.string(),
      volume: z.number().min(0).max(1).default(0.3),
      loop: z.boolean().default(true),
    })
    .optional(),
  scenes: z.array(SceneSchema),
});

export type NewsVideoConfig = z.infer<typeof NewsVideoSchema>;
