import fs from 'fs';
import path from 'path';
import { BatchRecord, EngineManifest } from '../types';

export class ManifestBuilder {
  public static buildAndSave(batch: BatchRecord, videoOutputs: { vertical?: string; horizontal?: string }): EngineManifest {
    const batchOutDir = path.resolve(process.cwd(), 'out', 'batches', batch.id);
    fs.mkdirSync(batchOutDir, { recursive: true });

    const manifest: EngineManifest = {
      batchId: batch.id,
      source: batch.source || 'ANBARILOCHE.COM.AR',
      createdAt: new Date().toISOString(),
      videos: {
        ...(videoOutputs.vertical && {
          vertical: {
            file: path.basename(videoOutputs.vertical),
            resolution: '1080x1920',
            path: videoOutputs.vertical,
          },
        }),
        ...(videoOutputs.horizontal && {
          horizontal: {
            file: path.basename(videoOutputs.horizontal),
            resolution: '1920x1080',
            path: videoOutputs.horizontal,
          },
        }),
      },
      storiesCount: batch.items.length,
      stories: batch.items.map((item) => ({
        order: item.order,
        id: item.id,
        title: item.title,
        subtitle: item.subtitle,
        category: item.category,
        sourceUrl: item.sourceUrl,
        localAsset: path.join('assets', item.localImageFile),
      })),
    };

    const manifestPath = path.join(batchOutDir, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
    console.log(`📄 [ManifestBuilder] Delivery manifest saved at -> ${manifestPath}`);

    return manifest;
  }
}
