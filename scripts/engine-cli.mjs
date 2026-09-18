#!/usr/bin/env node

/**
 * Autonomous News Video Engine CLI
 * Usage:
 *   node scripts/engine-cli.mjs scrape
 *   node scripts/engine-cli.mjs status
 *   node scripts/engine-cli.mjs produce [--quota=5]
 *   node scripts/engine-cli.mjs run [--quota=5]
 */

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import compiled or tsx module
async function loadEngine() {
  // Use tsx or ts-node or direct import if typescript is supported
  try {
    // Try importing via register or jiti or compiled
    const { NewsVideoEngine } = await import('../src/engine/index.ts');
    return new NewsVideoEngine();
  } catch (e) {
    // Fallback using child process or ts-node
    console.error('Failed to direct import TS file:', e.message);
    process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'status';

  let quota = 5;
  for (const arg of args) {
    if (arg.startsWith('--quota=')) {
      quota = parseInt(arg.split('=')[1], 10) || 5;
    }
  }

  const engine = await loadEngine();

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
      console.log(`🎬 [CLI] Triggering production (Quota: ${quota})...`);
      const res = await engine.produce({ quota });
      console.log(`\nResult:`, res.message);
      if (res.manifest) {
        console.log(`Manifest:`, res.manifest.videos);
      }
      break;
    }

    case 'run': {
      console.log(`🚀 [CLI] Running end-to-end pipeline (Scrape -> Check Quota -> Produce)...`);
      const res = await engine.run({ quota });
      console.log('\n🏁 Pipeline finished.');
      console.log('Scrape:', res.scrape);
      console.log('Production:', res.production.message);
      break;
    }

    default: {
      console.log(`Unknown command: ${command}`);
      console.log('Available commands: scrape, status, produce, run');
      process.exit(1);
    }
  }
}

main().catch((err) => {
  console.error('Fatal CLI Error:', err);
  process.exit(1);
});
