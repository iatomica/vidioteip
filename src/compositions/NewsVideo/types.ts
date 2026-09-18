import { z } from "zod";
import {
  NewsVideoSchema,
  SceneSchema,
  HeadlineSceneSchema,
  ImageSceneSchema,
  VideoSceneSchema,
  QuoteSceneSchema,
  StatSceneSchema,
  TimelineSceneSchema,
  ContextSceneSchema,
  MapSceneSchema,
  OutroSceneSchema,
  TransitionTypeSchema,
} from "./schema";
import { ThemeName } from "../../lib/config/themes";

export type { ThemeName };

export type NewsVideoProps = z.infer<typeof NewsVideoSchema>;
export type Scene = z.infer<typeof SceneSchema>;
export type SceneConfig = Scene;

export type HeadlineScene = z.infer<typeof HeadlineSceneSchema>;
export type HeadlineSceneProps = HeadlineScene;

export type ImageScene = z.infer<typeof ImageSceneSchema>;
export type ImageSceneProps = ImageScene;

export type VideoScene = z.infer<typeof VideoSceneSchema>;
export type VideoSceneProps = VideoScene;

export type QuoteScene = z.infer<typeof QuoteSceneSchema>;
export type QuoteSceneProps = QuoteScene;

export type StatScene = z.infer<typeof StatSceneSchema>;
export type StatSceneProps = StatScene;

export type TimelineScene = z.infer<typeof TimelineSceneSchema>;
export type TimelineSceneProps = TimelineScene;

export type ContextScene = z.infer<typeof ContextSceneSchema>;
export type ContextSceneProps = ContextScene;

export type MapScene = z.infer<typeof MapSceneSchema>;
export type MapSceneProps = MapScene;

export type OutroScene = z.infer<typeof OutroSceneSchema>;
export type OutroSceneProps = OutroScene;

export type TransitionType = z.infer<typeof TransitionTypeSchema>;

export interface TimelineSegment {
  scene: Scene;
  startFrame: number;
  durationInFrames: number;
  endFrame: number;
}
