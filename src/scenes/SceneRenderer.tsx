import React from 'react';
import { SceneConfig, ThemeName } from '../compositions/NewsVideo/types';
import { HeadlineScene } from './HeadlineScene/HeadlineScene';
import { ImageScene } from './ImageScene/ImageScene';
import { VideoScene } from './VideoScene/VideoScene';
import { QuoteScene } from './QuoteScene/QuoteScene';
import { StatScene } from './StatScene/StatScene';
import { TimelineScene } from './TimelineScene/TimelineScene';
import { ContextScene } from './ContextScene/ContextScene';
import { MapScene } from './MapScene/MapScene';
import { OutroScene } from './OutroScene/OutroScene';

interface SceneRendererProps {
  scene: SceneConfig;
  globalTheme: ThemeName;
}

export const SceneRenderer: React.FC<SceneRendererProps> = ({ scene, globalTheme }) => {
  const theme = scene.theme || globalTheme;

  switch (scene.type) {
    case 'headline':
      return <HeadlineScene scene={scene} theme={theme} />;
    case 'image':
      return <ImageScene scene={scene} theme={theme} />;
    case 'video':
      return <VideoScene scene={scene} theme={theme} />;
    case 'quote':
      return <QuoteScene scene={scene} theme={theme} />;
    case 'stat':
      return <StatScene scene={scene} theme={theme} />;
    case 'timeline':
      return <TimelineScene scene={scene} theme={theme} />;
    case 'context':
      return <ContextScene scene={scene} theme={theme} />;
    case 'map':
      return <MapScene scene={scene} theme={theme} />;
    case 'outro':
      return <OutroScene scene={scene} theme={theme} />;
    default: {
      const _exhaustiveCheck: never = scene;
      return (
        <div className="flex h-full w-full items-center justify-center bg-red-900 text-white font-mono">
          Unknown Scene Type: {JSON.stringify(_exhaustiveCheck)}
        </div>
      );
    }
  }
};
