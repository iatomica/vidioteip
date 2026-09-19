#!/usr/bin/env node

import { NewsVideoEngine } from './index';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'status';

  let quota = 5;
  let batchesCount = 1;
  let formats: ('vertical' | 'horizontal')[] = ['vertical', 'horizontal'];
  let templateId: string | undefined = undefined;

  for (const arg of args) {
    if (arg.startsWith('--quota=')) {
      quota = parseInt(arg.split('=')[1], 10) || 5;
    } else if (arg.startsWith('--batches=')) {
      batchesCount = parseInt(arg.split('=')[1], 10) || 1;
    } else if (arg === '--vertical-only' || arg === '--vertical') {
      formats = ['vertical'];
    } else if (arg.startsWith('--formats=')) {
      formats = arg.split('=')[1].split(',') as any;
    } else if (arg.startsWith('--template=')) {
      templateId = arg.split('=')[1].trim();
    }
  }

  const engine = new NewsVideoEngine();

  switch (command) {
    case 'scrape': {
      console.log('📰 [CLI] Running scraper...');
      const res = await engine.scrape();
      console.log('\n📊 Scrape Summary:', res);
      break;
    }

    case 'status': {
      const status = engine.getStatus();
      console.log('\n📋 [CLI] Registry Overview:');
      console.table(status.overview);
      console.log(`\n⏳ Pending queue: ${status.pendingArticles.length} articles`);
      if (status.pendingArticles.length > 0) {
        console.table(
          status.pendingArticles.map((a, i) => ({
            '#': i + 1,
            ID: a.id,
            Categoría: a.category,
            Título: a.title.slice(0, 50) + '...',
            Fecha: a.discoveredAt.split('T')[0],
          }))
        );
      }
      if (status.batches.length > 0) {
        console.log(`\n📦 Recent Batches (${status.batches.length}):`);
        console.table(
          status.batches.slice(-5).map((b) => ({
            BatchID: b.id,
            Status: b.status,
            Stories: b.items.length,
            Date: b.createdAt,
          }))
        );
      }
      break;
    }

    case 'produce': {
      console.log(`🎬 [CLI] Triggering production (${batchesCount} batch(es), Quota: ${quota}, Formats: ${formats.join(', ')})...`);
      for (let b = 0; b < batchesCount; b++) {
        console.log(`\n========================================`);
        console.log(`🎬 Processing Batch ${b + 1} of ${batchesCount}...`);
        console.log(`========================================`);
        const res = await engine.produce({ quota, formats, templateId });
        console.log(`\nResult:`, res.message);
        if (res.status !== 'produced') {
          console.warn(`Stopping: ${res.message}`);
          break;
        }
        if (res.manifest) {
          console.log(`Manifest:`, res.manifest.videos);
        }
      }
      break;
    }

    case 'run': {
      console.log(`🚀 [CLI] Running end-to-end pipeline (Scrape -> Check Quota -> Produce)...`);
      const res = await engine.run({ quota, templateId });
      console.log('\n🏁 Pipeline finished.');
      console.log('Scrape:', res.scrape);
      console.log('Production:', res.production.message);
      break;
    }

    case 'clean': {
      console.log('🧹 [CLI] Running retention & storage cleanup...');
      const report = engine.cleanup();
      console.log('\n📊 Cleanup Report:', report);
      break;
    }

    default: {
      console.log(`Unknown command: ${command}`);
      console.log('Available commands: scrape, status, produce, run, clean');
      process.exit(1);
    }
  }
}

main().catch((err) => {
  console.error('Fatal CLI Error:', err);
  process.exit(1);
});
