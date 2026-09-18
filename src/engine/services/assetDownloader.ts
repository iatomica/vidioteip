import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { BatchRecord } from '../types';

export class AssetDownloader {
  /**
   * Downloads all article images for a given batch.
   * Stores them in public/images/batches/{batchId}/ and public/assets/images/batches/{batchId}/
   */
  public async downloadBatchImages(batch: BatchRecord): Promise<{ success: boolean; errors: string[] }> {
    const batchImagesDir = path.resolve(process.cwd(), 'public', 'images', 'batches', batch.id);
    const batchAssetsDir = path.resolve(process.cwd(), 'public', 'assets', 'images', 'batches', batch.id);

    fs.mkdirSync(batchImagesDir, { recursive: true });
    fs.mkdirSync(batchAssetsDir, { recursive: true });

    const errors: string[] = [];

    for (const item of batch.items) {
      const destPath1 = path.join(batchImagesDir, item.localImageFile);
      const destPath2 = path.join(batchAssetsDir, item.localImageFile);

      console.log(`[AssetDownloader] Downloading [${item.order}/${batch.items.length}] -> ${item.localImageFile}...`);

      try {
        await this.downloadFile(item.imageUrl, destPath1);
        // Mirror to assets dir as well
        fs.copyFileSync(destPath1, destPath2);
      } catch (e: any) {
        console.error(`[AssetDownloader] Error downloading ${item.imageUrl}: ${e.message}`);
        errors.push(`Scene ${item.order}: ${e.message}`);
      }
    }

    return {
      success: errors.length === 0,
      errors,
    };
  }

  private downloadFile(url: string, dest: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url);
      const client = parsedUrl.protocol === 'https:' ? https : http;

      const req = client.get(
        url,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          },
          timeout: 15000,
        },
        (res) => {
          // Follow redirect
          if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            return this.downloadFile(res.headers.location, dest).then(resolve).catch(reject);
          }

          if (res.statusCode !== 200) {
            return reject(new Error(`Server returned HTTP ${res.statusCode}`));
          }

          const file = fs.createWriteStream(dest);
          res.pipe(file);

          file.on('finish', () => {
            file.close(() => resolve());
          });

          file.on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err);
          });
        }
      );

      req.on('error', (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });

      req.on('timeout', () => {
        req.destroy(new Error('Download timeout'));
      });
    });
  }
}
