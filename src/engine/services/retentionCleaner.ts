import fs from 'fs';
import path from 'path';
import { RegistryStore } from '../storage/registry';
import { EngineConfig } from '../config';

export interface CleanupReport {
  purgedProducedArticles: number;
  purgedStalePendingArticles: number;
  deletedOutBatches: string[];
  deletedMediaDirs: string[];
}

export class RetentionCleaner {
  private registry: RegistryStore;

  constructor(registry: RegistryStore) {
    this.registry = registry;
  }

  /**
   * Performs complete retention cleanup:
   * 1. Old produced articles in registry (older than producedDaysToKeep)
   * 2. Stale pending articles in registry (older than pendingMaxAgeDays)
   * 3. Old batch outputs in out/batches/ (older than outBatchesDaysToKeep)
   * 4. Old cached images in public/images/batches/ and public/assets/images/batches/
   */
  public clean(config: EngineConfig): CleanupReport {
    const report: CleanupReport = {
      purgedProducedArticles: 0,
      purgedStalePendingArticles: 0,
      deletedOutBatches: [],
      deletedMediaDirs: [],
    };

    const now = Date.now();
    const msInDay = 24 * 60 * 60 * 1000;

    const producedThresholdMs = now - config.retention.producedDaysToKeep * msInDay;
    const pendingThresholdMs = now - config.retention.pendingMaxAgeDays * msInDay;
    const outThresholdMs = now - config.retention.outBatchesDaysToKeep * msInDay;

    console.log(`\n🧹 [RetentionCleaner] Starting automated retention cleanup...`);
    console.log(`   - Produced news retention: ${config.retention.producedDaysToKeep} days`);
    console.log(`   - Stale pending threshold: ${config.retention.pendingMaxAgeDays} days`);
    console.log(`   - Out batches & media retention: ${config.retention.outBatchesDaysToKeep} days`);

    // 1. Clean Registry Entries
    const registryResult = this.registry.pruneByRetention({
      producedBeforeMs: producedThresholdMs,
      pendingBeforeMs: pendingThresholdMs,
    });
    report.purgedProducedArticles = registryResult.purgedProduced;
    report.purgedStalePendingArticles = registryResult.purgedPending;

    // 2. Clean out/batches/
    const outBatchesDir = path.resolve(process.cwd(), 'out', 'batches');
    if (fs.existsSync(outBatchesDir)) {
      const batchFolders = fs.readdirSync(outBatchesDir);
      for (const folder of batchFolders) {
        const folderPath = path.join(outBatchesDir, folder);
        try {
          const stats = fs.statSync(folderPath);
          if (stats.isDirectory() && stats.mtimeMs < outThresholdMs) {
            fs.rmSync(folderPath, { recursive: true, force: true });
            report.deletedOutBatches.push(folder);
            console.log(`   🗑️ Removed expired output batch: out/batches/${folder}`);
          }
        } catch (err: any) {
          console.warn(`   ⚠️ Error pruning ${folderPath}: ${err.message}`);
        }
      }
    }

    // 3. Clean public/images/batches/ and public/assets/images/batches/
    const mediaLocations = [
      path.resolve(process.cwd(), 'public', 'images', 'batches'),
      path.resolve(process.cwd(), 'public', 'assets', 'images', 'batches'),
    ];

    for (const mediaDir of mediaLocations) {
      if (fs.existsSync(mediaDir)) {
        const batchFolders = fs.readdirSync(mediaDir);
        for (const folder of batchFolders) {
          const folderPath = path.join(mediaDir, folder);
          try {
            const stats = fs.statSync(folderPath);
            if (stats.isDirectory() && stats.mtimeMs < outThresholdMs) {
              fs.rmSync(folderPath, { recursive: true, force: true });
              report.deletedMediaDirs.push(folderPath);
              console.log(`   🗑️ Removed expired media cache: ${path.relative(process.cwd(), folderPath)}`);
            }
          } catch (err: any) {
            console.warn(`   ⚠️ Error pruning media ${folderPath}: ${err.message}`);
          }
        }
      }
    }

    console.log(`✨ [RetentionCleaner] Finished cleanup:`);
    console.log(`   • Purged produced records: ${report.purgedProducedArticles}`);
    console.log(`   • Discarded stale pending: ${report.purgedStalePendingArticles}`);
    console.log(`   • Deleted output batches:  ${report.deletedOutBatches.length}`);
    console.log(`   • Deleted media folders:   ${report.deletedMediaDirs.length}`);

    return report;
  }
}
