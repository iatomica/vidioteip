import React from 'react';
import { Composition } from 'remotion';
import { NewsVideo } from './compositions/NewsVideo/NewsVideo';
import { NewsVideoSchema } from './compositions/NewsVideo/schema';
import { calculateTotalDuration } from './lib/timing/timeline';
import { anbarilocheNewsData } from './data/anbariloche-news';
import { VERTICAL_VIDEO, HORIZONTAL_VIDEO } from './lib/config/video';
import './style.css';

export const Root: React.FC = () => {
  const barilocheDuration = calculateTotalDuration(anbarilocheNewsData.scenes);

  return (
    <>
      {/* 1. ANBariloche 5-News Summary (Vertical 9:16) */}
      <Composition
        id="BarilocheVertical"
        component={NewsVideo}
        durationInFrames={barilocheDuration}
        fps={VERTICAL_VIDEO.fps}
        width={VERTICAL_VIDEO.width}
        height={VERTICAL_VIDEO.height}
        schema={NewsVideoSchema}
        defaultProps={{
          ...anbarilocheNewsData,
          format: 'vertical',
        }}
        calculateMetadata={({ props }) => {
          return {
            durationInFrames: calculateTotalDuration(props.scenes),
          };
        }}
      />

      {/* 2. ANBariloche 5-News Summary (Horizontal 16:9) */}
      <Composition
        id="BarilocheHorizontal"
        component={NewsVideo}
        durationInFrames={barilocheDuration}
        fps={HORIZONTAL_VIDEO.fps}
        width={HORIZONTAL_VIDEO.width}
        height={HORIZONTAL_VIDEO.height}
        schema={NewsVideoSchema}
        defaultProps={{
          ...anbarilocheNewsData,
          format: 'horizontal',
        }}
        calculateMetadata={({ props }) => {
          return {
            durationInFrames: calculateTotalDuration(props.scenes),
          };
        }}
      />
    </>
  );
};
