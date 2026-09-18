import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';
import { BatchRecord } from '../types';

export interface RenderResult {
  success: boolean;
  verticalOutput?: string;
  horizontalOutput?: string;
  errors: string[];
}

export class VideoRenderer {
  /**
   * Renders both vertical (9:16) and horizontal (16:9) versions of a sealed batch.
   */
  public async renderBatch(
    batch: BatchRecord,
    propsFilePath: string,
    options: { formats?: ('vertical' | 'horizontal')[] } = {}
  ): Promise<RenderResult> {
    const formats = options.formats || ['vertical', 'horizontal'];
    const batchOutDir = path.resolve(process.cwd(), 'out', 'batches', batch.id);
    fs.mkdirSync(batchOutDir, { recursive: true });

    const result: RenderResult = {
      success: true,
      errors: [],
    };

    if (formats.includes('vertical')) {
      const vertFile = path.join(batchOutDir, 'bariloche-summary-vertical.mp4');
      console.log(`\n🎬 [VideoRenderer] Starting Vertical Render for ${batch.id}...`);
      const ok = await this.executeRemotionRender('BarilocheVertical', vertFile, propsFilePath);
      if (ok) {
        result.verticalOutput = vertFile;
        // Also maintain latest copy in out/
        fs.copyFileSync(vertFile, path.resolve(process.cwd(), 'out', 'bariloche-summary.mp4'));
      } else {
        result.success = false;
        result.errors.push('Vertical render failed');
      }
    }

    if (formats.includes('horizontal')) {
      const horizFile = path.join(batchOutDir, 'bariloche-summary-horizontal.mp4');
      console.log(`\n🎬 [VideoRenderer] Starting Horizontal Render for ${batch.id}...`);
      const ok = await this.executeRemotionRender('BarilocheHorizontal', horizFile, propsFilePath);
      if (ok) {
        result.horizontalOutput = horizFile;
        // Also maintain latest copy in out/
        fs.copyFileSync(horizFile, path.resolve(process.cwd(), 'out', 'bariloche-summary-horizontal.mp4'));
      } else {
        result.success = false;
        result.errors.push('Horizontal render failed');
      }
    }

    return result;
  }

  private executeRemotionRender(composition: string, dest: string, propsFile: string): Promise<boolean> {
    return new Promise((resolve) => {
      // Use cmd /c npx remotion render for maximum Windows compatibility
      const isWindows = process.platform === 'win32';
      const cmd = isWindows ? 'cmd.exe' : 'npx';
      const args = isWindows
        ? ['/c', 'npx', 'remotion', 'render', composition, dest, `--props=${propsFile}`]
        : ['remotion', 'render', composition, dest, `--props=${propsFile}`];

      console.log(`[VideoRenderer] Running: ${cmd} ${args.join(' ')}`);

      const child = spawn(cmd, args, {
        cwd: process.cwd(),
        stdio: 'inherit',
        env: { ...process.env },
      });

      child.on('close', (code) => {
        if (code === 0) {
          console.log(`✅ [VideoRenderer] Successfully rendered ${composition} -> ${dest}`);
          resolve(true);
        } else {
          console.error(`❌ [VideoRenderer] Remotion exited with code ${code}`);
          resolve(false);
        }
      });

      child.on('error', (err) => {
        console.error(`❌ [VideoRenderer] Execution error:`, err);
        resolve(false);
      });
    });
  }
}
