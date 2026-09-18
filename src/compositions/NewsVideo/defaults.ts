import { NewsVideoProps } from './types';

export const defaultNewsVideoProps: NewsVideoProps = {
  title: 'BREAKING: Deep Ocean Signal Detected',
  source: 'GLOBAL SCIENCE NETWORK',
  date: '2026-09-15',
  topic: 'Marine Geophysics',
  theme: 'news-modern',
  format: 'vertical',
  showSafeAreas: false,
  debug: false,
  tickerItems: [
    'SCIENTISTS DETECT MYSTERIOUS RHYTHMIC ACOUSTIC PULSE IN PACIFIC TRENCH',
    'FREQUENCY: 14.3 HZ REPEATING EVERY 12.8 SECONDS',
    'OCEANOGRAPHIC TEAMS DEPLOY AUTONOMOUS SUBMERSIBLES',
  ],
  scenes: [
    {
      id: 'scene-1',
      type: 'headline',
      durationInFrames: 120, // 4 seconds @ 30fps
      transition: 'fade',
      content: {
        kicker: 'BREAKING DISCOVERY',
        title: 'Deep Ocean Signal Discovered in Pacific',
        subtitle: 'Unusual rhythmic acoustic pattern detected 6,000 meters below sea level.',
        source: 'GLOBAL SCIENCE NETWORK',
        date: 'SEPTEMBER 2026',
        badgeText: 'SPECIAL REPORT',
      },
    },
    {
      id: 'scene-2',
      type: 'map',
      durationInFrames: 105, // 3.5 seconds
      transition: 'slide',
      content: {
        kicker: 'ACOUSTIC ORIGIN',
        location: 'Kermadec Trench',
        locationName: 'Kermadec Trench',
        coordinates: "31°12'S 177°28'W",
        description: 'Hydrophone array network tracked epicenter to abyssal depths.',
      },
    },
    {
      id: 'scene-3',
      type: 'stat',
      durationInFrames: 120, // 4 seconds
      transition: 'zoom',
      content: {
        kicker: 'SIGNAL METRICS',
        value: 14.3,
        numberValue: 14.3,
        decimals: 1,
        suffix: ' Hz',
        numberSuffix: ' Hz',
        label: 'Acoustic Pulse Frequency',
        comparison: 'Repeated consistently every 12.8 seconds over 72 hours',
      },
    },
    {
      id: 'scene-4',
      type: 'quote',
      durationInFrames: 120, // 4 seconds
      transition: 'fade-through-black',
      content: {
        quote: 'We have never recorded a geological pulse with this degree of harmonic precision.',
        author: 'Dr. Elena Rostova',
        role: 'Chief Oceanographer, Pacific Marine Institute',
      },
    },
    {
      id: 'scene-5',
      type: 'context',
      durationInFrames: 135, // 4.5 seconds
      transition: 'push',
      content: {
        kicker: 'KEY TAKEAWAYS',
        title: 'What We Know So Far',
        points: [
          'Signal origin verified at 6,200m depth',
          'Not matching any known volcanic or tectonic profiles',
          'Two deep-sea submersibles en route for direct sensor deployment',
          'Full peer-reviewed dataset releasing next week',
        ],
      },
    },
    {
      id: 'scene-6',
      type: 'outro',
      durationInFrames: 90, // 3 seconds
      transition: 'fade',
      content: {
        title: 'STAY INFORMED',
        channelName: 'SCIENCE CHRONICLE',
        callToAction: 'Stay tuned for mission updates',
        website: 'sciencechronicle.org',
        socialHandles: ['@ScienceChronicle', 'YouTube: /sciencechronicle'],
      },
    },
  ],
};
