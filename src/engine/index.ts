import { RegistryStore } from './storage/registry';
import { ANBarilocheScraper } from './scrapers/anbariloche';
import { ScraperProvider, BatchRecord, EngineManifest } from './types';
import { AssetDownloader } from './services/assetDownloader';
import { BatchManager } from './services/batchManager';
import { VideoRenderer } from './services/videoRenderer';
import { ManifestBuilder } from './services/manifestBuilder';
import { RetentionCleaner, CleanupReport } from './services/retentionCleaner';
import { loadConfig, EngineConfig } from './config';

export * from './types';
export * from './config';
export { RegistryStore } from './storage/registry';
export { BaseScraper } from './scrapers/base';
export { ANBarilocheScraper } from './scrapers/anbariloche';
export { RetentionCleaner } from './services/retentionCleaner';

export interface PipelineOptions {
  quota?: number;
  portalId?: string;
  audioSrc?: string;
  audioVolume?: number;
  formats?: ('vertical' | 'horizontal')[];
  forceProduce?: boolean;
  templateId?: string;
  themeMode?: 'dark' | 'light';
}

export class NewsVideoEngine {
  private config: EngineConfig;
  private registry: RegistryStore;
  private scrapers: Map<string, ScraperProvider> = new Map();
  private downloader: AssetDownloader;
  private batchManager: BatchManager;
  private renderer: VideoRenderer;
  private cleaner: RetentionCleaner;

  constructor(customRegistryPath?: string, customConfigPath?: string) {
    this.config = loadConfig(customConfigPath);
    this.registry = new RegistryStore(customRegistryPath);
    this.downloader = new AssetDownloader();
    this.batchManager = new BatchManager();
    this.renderer = new VideoRenderer();
    this.cleaner = new RetentionCleaner(this.registry);

    // Register scrapers enabled in config
    if (this.config.sources.anbariloche?.enabled !== false) {
      this.registerScraper(new ANBarilocheScraper(this.config.sources.anbariloche?.baseUrl));
    }
  }

  public getConfig(): EngineConfig {
    return this.config;
  }

  /**
   * Extensibility: Add any new news provider
   */
  public registerScraper(scraper: ScraperProvider): void {
    this.scrapers.set(scraper.name, scraper);
  }

  /**
   * 1. Scrape latest articles from one or all providers and register them
   */
  public async scrape(portalId?: string): Promise<{ totalFound: number; added: number; skippedDuplicates: number }> {
    const targetScrapers = portalId
      ? [this.scrapers.get(portalId)].filter((s): s is ScraperProvider => !!s)
      : Array.from(this.scrapers.values());

    let totalFound = 0;
    let totalAdded = 0;
    let totalDuplicates = 0;

    for (const scraper of targetScrapers) {
      console.log(`\n🔍 [Engine] Scraping from provider: ${scraper.displayName}...`);
      const articles = await scraper.fetchLatestArticles();
      totalFound += articles.length;

      const res = this.registry.registerArticles(articles);
      totalAdded += res.added;
      totalDuplicates += res.skippedDuplicates;

      console.log(`   -> Found: ${articles.length}, New registered: ${res.added}, Duplicates skipped: ${res.skippedDuplicates}`);
    }

    return { totalFound, added: totalAdded, skippedDuplicates: totalDuplicates };
  }

  /**
   * 2. Inspect status of queue, pending articles and batches
   */
  public getStatus() {
    return {
      config: this.config,
      overview: this.registry.getStatusOverview(),
      pendingArticles: this.registry.getPendingArticles(),
      batches: this.registry.getBatches(),
    };
  }

  /**
   * 3. Run periodic retention cleanup of registry and out/ media files
   */
  public cleanup(customConfig?: EngineConfig): CleanupReport {
    return this.cleaner.clean(customConfig || this.config);
  }

  /**
   * 4. Produce a batch of N news if quota is met
   */
  public async produce(options: PipelineOptions = {}): Promise<{
    batch: BatchRecord | null;
    manifest: EngineManifest | null;
    status: 'produced' | 'quota_not_met' | 'error';
    message: string;
  }> {
    const quota = options.quota || this.config.general.quota || 5;
    const portalId = options.portalId || 'anbariloche';

    const pending = this.registry.getPendingArticles(portalId);
    console.log(`\n📦 [Engine] Checking production quota: ${pending.length}/${quota} pending articles available.`);

    if (pending.length < quota && !options.forceProduce) {
      return {
        batch: null,
        manifest: null,
        status: 'quota_not_met',
        message: `Quota not met. Current pending queue has ${pending.length} articles, needs ${quota}.`,
      };
    }

    // 1. Seal batch
    const batch = this.registry.sealBatch(quota, portalId);
    if (!batch) {
      return {
        batch: null,
        manifest: null,
        status: 'quota_not_met',
        message: `Could not seal batch.`,
      };
    }

    console.log(`\n✨ [Engine] Sealed batch: ${batch.id} with ${batch.items.length} stories.`);

    try {
      // 2. Download high-resolution images
      console.log(`\n📥 [Engine] Downloading images for batch ${batch.id}...`);
      const downloadRes = await this.downloader.downloadBatchImages(batch);
      if (!downloadRes.success) {
        console.warn(`[Engine] Warning: Some images had errors:`, downloadRes.errors);
      }

      // 3. Assemble dynamic video props with config defaults
      const audioSrc = options.audioSrc || (this.config.audio.enabled ? this.config.audio.src || undefined : undefined);
      const audioVolume = options.audioVolume ?? this.config.audio.volume ?? 0.25;

      const videoProps = this.batchManager.createVideoProps(batch, {
        audioSrc,
        audioVolume,
        templateId: options.templateId,
        themeMode: options.themeMode,
      });
      const propsFile = this.batchManager.saveBatchProps(batch, videoProps);

      // 4. Render videos headless
      const targetFormats = options.formats || this.config.video.formats || ['vertical', 'horizontal'];
      console.log(`\n🎥 [Engine] Rendering video batch headless with Remotion (${targetFormats.join(', ')})...`);
      const renderRes = await this.renderer.renderBatch(batch, propsFile, {
        formats: targetFormats,
      });

      if (!renderRes.success) {
        this.registry.markBatchFailed(batch.id);
        return {
          batch,
          manifest: null,
          status: 'error',
          message: `Render failed: ${renderRes.errors.join(', ')}`,
        };
      }

      // 5. Mark completed in registry
      this.registry.markBatchCompleted(batch.id, {
        vertical: renderRes.verticalOutput,
        horizontal: renderRes.horizontalOutput,
      });

      // 6. Build delivery manifest
      const manifest = ManifestBuilder.buildAndSave(batch, {
        vertical: renderRes.verticalOutput,
        horizontal: renderRes.horizontalOutput,
      });

      return {
        batch,
        manifest,
        status: 'produced',
        message: `Batch ${batch.id} produced successfully!`,
      };
    } catch (err: any) {
      this.registry.markBatchFailed(batch.id);
      return {
        batch,
        manifest: null,
        status: 'error',
        message: `Execution exception: ${err.message}`,
      };
    }
  }

  /**
   * 5. Complete pipeline: Auto-clean -> Scrape -> Check quota -> If quota reached, Produce
   */
  public async run(options: PipelineOptions = {}) {
    console.log(`\n🚀 [Engine] Starting autonomous pipeline cycle...`);

    let cleanupReport: CleanupReport | null = null;
    if (this.config.general.autoCleanupOnRun) {
      cleanupReport = this.cleanup();
    }

    const scrapeRes = await this.scrape(options.portalId);
    const produceRes = await this.produce(options);

    return {
      cleanup: cleanupReport,
      scrape: scrapeRes,
      production: produceRes,
    };
  }
}
