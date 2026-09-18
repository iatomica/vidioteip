export type ArticleStatus = 'pending' | 'batched' | 'produced' | 'discarded';

export interface RawArticle {
  portalId: string;           // e.g. 'anbariloche'
  externalId: string;         // e.g. '117541'
  url: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  category?: string;
  date?: string;
  source: string;
}

export interface RegistryEntry extends RawArticle {
  id: string;                 // unique key: `${portalId}_${externalId}`
  titleHash: string;          // SHA-256 / simple hash of normalized title
  status: ArticleStatus;
  batchId?: string;
  discoveredAt: string;
  producedAt?: string;
}

export interface BatchItem {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  category: string;
  sourceUrl: string;
  imageUrl: string;
  localImageFile: string;
  source: string;
}

export interface BatchRecord {
  id: string;                 // e.g. 'batch_20260918_143000_anb'
  source: string;
  createdAt: string;
  articleIds: string[];
  items: BatchItem[];
  status: 'created' | 'rendering' | 'completed' | 'failed';
  videoOutputs?: {
    vertical?: string;
    horizontal?: string;
  };
}

export interface EngineManifest {
  batchId: string;
  source: string;
  createdAt: string;
  videos: {
    vertical?: {
      file: string;
      resolution: string;
      path: string;
    };
    horizontal?: {
      file: string;
      resolution: string;
      path: string;
    };
  };
  storiesCount: number;
  stories: {
    order: number;
    id: string;
    title: string;
    subtitle: string;
    category: string;
    sourceUrl: string;
    localAsset: string;
  }[];
}

export interface ScraperProvider {
  name: string;
  displayName: string;
  fetchLatestArticles(): Promise<RawArticle[]>;
}
