import fs from 'fs';
import path from 'path';

export interface EngineConfig {
  general: {
    quota: number;
    autoCleanupOnRun: boolean;
  };
  retention: {
    producedDaysToKeep: number;
    pendingMaxAgeDays: number;
    outBatchesDaysToKeep: number;
  };
  video: {
    theme: string;
    formats: ('vertical' | 'horizontal')[];
    sceneDurationSeconds: number;
    outroDurationSeconds: number;
  };
  audio: {
    enabled: boolean;
    src: string | null;
    volume: number;
  };
  sources: Record<
    string,
    {
      enabled: boolean;
      baseUrl?: string;
      pollIntervalMinutes?: number;
    }
  >;
}

export const DEFAULT_CONFIG: EngineConfig = {
  general: {
    quota: 5,
    autoCleanupOnRun: true,
  },
  retention: {
    producedDaysToKeep: 30,
    pendingMaxAgeDays: 3,
    outBatchesDaysToKeep: 15,
  },
  video: {
    theme: 'editorial-calm',
    formats: ['vertical', 'horizontal'],
    sceneDurationSeconds: 4.5,
    outroDurationSeconds: 3.5,
  },
  audio: {
    enabled: false,
    src: null,
    volume: 0.25,
  },
  sources: {
    anbariloche: {
      enabled: true,
      baseUrl: 'https://www.anbariloche.com.ar',
      pollIntervalMinutes: 30,
    },
  },
};

export function loadConfig(customConfigPath?: string): EngineConfig {
  const configPath = customConfigPath || path.resolve(process.cwd(), 'config', 'engine.config.json');

  try {
    if (fs.existsSync(configPath)) {
      const raw = fs.readFileSync(configPath, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_CONFIG,
        ...parsed,
        general: { ...DEFAULT_CONFIG.general, ...(parsed.general || {}) },
        retention: { ...DEFAULT_CONFIG.retention, ...(parsed.retention || {}) },
        video: { ...DEFAULT_CONFIG.video, ...(parsed.video || {}) },
        audio: { ...DEFAULT_CONFIG.audio, ...(parsed.audio || {}) },
        sources: { ...DEFAULT_CONFIG.sources, ...(parsed.sources || {}) },
      };
    }
  } catch (err: any) {
    console.warn(`[Config] Warning reading ${configPath}: ${err.message}. Using default configuration.`);
  }

  return DEFAULT_CONFIG;
}
