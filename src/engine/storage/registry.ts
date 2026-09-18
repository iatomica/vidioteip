import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { RawArticle, RegistryEntry, BatchRecord } from '../types';

export interface RegistryData {
  version: number;
  lastUpdated: string;
  articles: Record<string, RegistryEntry>; // keyed by id (portalId_externalId)
  batches: Record<string, BatchRecord>;
}

const DEFAULT_REGISTRY_PATH = path.resolve(process.cwd(), 'data', 'registry.json');

function hashTitle(title: string): string {
  const normalized = title.toLowerCase().trim().replace(/[^\w\s]/g, '');
  return crypto.createHash('sha256').update(normalized).digest('hex').slice(0, 16);
}

export class RegistryStore {
  private filePath: string;
  private data: RegistryData;

  constructor(customPath?: string) {
    this.filePath = customPath || DEFAULT_REGISTRY_PATH;
    this.data = this.load();
  }

  private load(): RegistryData {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error(`[RegistryStore] Warning: failed to parse ${this.filePath}, initializing empty registry.`, e);
    }
    return {
      version: 1,
      lastUpdated: new Date().toISOString(),
      articles: {},
      batches: {},
    };
  }

  private save(): void {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    this.data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  /**
   * Registers newly scraped articles.
   * Returns stats: { totalChecked, added, skippedDuplicates }
   */
  public registerArticles(articles: RawArticle[]): { totalChecked: number; added: number; skippedDuplicates: number } {
    let added = 0;
    let skippedDuplicates = 0;

    // Build quick hash set of all existing articles
    const existingHashes = new Set(
      Object.values(this.data.articles).map((a) => a.titleHash)
    );

    for (const raw of articles) {
      const id = `${raw.portalId}_${raw.externalId}`;
      const titleHash = hashTitle(raw.title);

      // Check duplicate by primary ID or by Title Hash
      if (this.data.articles[id] || existingHashes.has(titleHash)) {
        skippedDuplicates++;
        continue;
      }

      const entry: RegistryEntry = {
        ...raw,
        id,
        titleHash,
        status: 'pending',
        discoveredAt: new Date().toISOString(),
      };

      this.data.articles[id] = entry;
      existingHashes.add(titleHash);
      added++;
    }

    if (added > 0) {
      this.save();
    }

    return { totalChecked: articles.length, added, skippedDuplicates };
  }

  /**
   * Get all pending articles sorted by discovery time (oldest first or newest first)
   */
  public getPendingArticles(portalId?: string): RegistryEntry[] {
    return Object.values(this.data.articles)
      .filter((a) => a.status === 'pending' && (!portalId || a.portalId === portalId))
      .sort((a, b) => new Date(a.discoveredAt).getTime() - new Date(b.discoveredAt).getTime());
  }

  /**
   * Check if we have reached the batch quota (e.g. 5)
   */
  public hasQuota(quota = 5, portalId?: string): boolean {
    return this.getPendingArticles(portalId).length >= quota;
  }

  /**
   * Seal a batch of N articles for production
   */
  public sealBatch(quota = 5, portalId?: string): BatchRecord | null {
    const pending = this.getPendingArticles(portalId);
    if (pending.length < quota) {
      return null;
    }

    const selected = pending.slice(0, quota);
    const dateStr = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
    const batchId = `batch_${dateStr}_${portalId || 'news'}`;

    const batchRecord: BatchRecord = {
      id: batchId,
      source: selected[0]?.source || 'Portal',
      createdAt: new Date().toISOString(),
      articleIds: selected.map((s) => s.id),
      items: selected.map((s, idx) => ({
        id: s.id,
        order: idx + 1,
        title: s.title,
        subtitle: s.subtitle,
        category: s.category || 'ACTUALIDAD',
        sourceUrl: s.url,
        imageUrl: s.imageUrl,
        localImageFile: `scene_${idx + 1}.webp`,
        source: s.source,
      })),
      status: 'created',
    };

    // Mark articles as batched
    for (const item of selected) {
      this.data.articles[item.id].status = 'batched';
      this.data.articles[item.id].batchId = batchId;
    }

    this.data.batches[batchId] = batchRecord;
    this.save();

    return batchRecord;
  }

  /**
   * Mark batch completed and set articles to 'produced'
   */
  public markBatchCompleted(batchId: string, videoOutputs: { vertical?: string; horizontal?: string }): void {
    const batch = this.data.batches[batchId];
    if (!batch) return;

    batch.status = 'completed';
    batch.videoOutputs = videoOutputs;

    const now = new Date().toISOString();
    for (const artId of batch.articleIds) {
      if (this.data.articles[artId]) {
        this.data.articles[artId].status = 'produced';
        this.data.articles[artId].producedAt = now;
      }
    }
    this.save();
  }

  /**
   * Mark batch failed and release articles back to 'pending'
   */
  public markBatchFailed(batchId: string): void {
    const batch = this.data.batches[batchId];
    if (!batch) return;

    batch.status = 'failed';
    for (const artId of batch.articleIds) {
      if (this.data.articles[artId]) {
        this.data.articles[artId].status = 'pending';
        delete this.data.articles[artId].batchId;
      }
    }
    this.save();
  }

  /**
   * Get ledger status overview
   */
  public getStatusOverview(): {
    totalArticles: number;
    pending: number;
    batched: number;
    produced: number;
    discarded: number;
    totalBatches: number;
    completedBatches: number;
  } {
    const all = Object.values(this.data.articles);
    const batches = Object.values(this.data.batches);
    return {
      totalArticles: all.length,
      pending: all.filter((a) => a.status === 'pending').length,
      batched: all.filter((a) => a.status === 'batched').length,
      produced: all.filter((a) => a.status === 'produced').length,
      discarded: all.filter((a) => a.status === 'discarded').length,
      totalBatches: batches.length,
      completedBatches: batches.filter((b) => b.status === 'completed').length,
    };
  }

  public getBatches(): BatchRecord[] {
    return Object.values(this.data.batches);
  }
}
