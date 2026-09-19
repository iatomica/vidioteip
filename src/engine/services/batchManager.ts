import fs from 'fs';
import path from 'path';
import { BatchRecord } from '../types';
import { NewsVideoProps, Scene } from '../../compositions/NewsVideo/types';

export interface BatchPropsOptions {
  audioSrc?: string;
  audioVolume?: number;
  format?: 'vertical' | 'horizontal';
  templateId?: string;
  themeMode?: 'dark' | 'light';
}

export class BatchManager {
  /**
   * Generates the NewsVideoProps data payload for Remotion
   */
  public createVideoProps(batch: BatchRecord, options: BatchPropsOptions = {}): NewsVideoProps {
    const format = options.format || 'vertical';
    const monthYear = new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }).toUpperCase();
    const templateId = options.templateId || 'design-1-black';
    const themeMode = options.themeMode || (templateId.includes('white') ? 'light' : 'dark');

    const scenes: Scene[] = batch.items.map((item) => ({
      id: `${batch.id}-scene-${item.order}`,
      type: 'headline' as const,
      durationInFrames: 135, // 4.5 seconds at 30 fps
      transition: 'fade' as const,
      content: {
        kicker: item.category,
        title: item.title,
        subtitle: item.subtitle,
        badgeText: item.category,
        source: item.source || 'ANBariloche',
        backgroundImage: `images/batches/${batch.id}/${item.localImageFile}`,
        templateId,
        themeMode,
      },
    }));

    // Add Outro Scene
    scenes.push({
      id: `${batch.id}-scene-outro`,
      type: 'outro' as const,
      durationInFrames: 105, // 3.5 seconds
      transition: 'fade' as const,
      content: {
        title: 'Noticias de la Patagonia',
        callToAction: 'Noticias de la Patagonia',
      },
    });

    const videoProps: NewsVideoProps = {
      title: 'Resumen de Noticias // ANBariloche',
      subtitle: `Las ${batch.items.length} novedades más destacadas de Bariloche y la región`,
      source: batch.source || 'ANBARILOCHE.COM.AR',
      date: monthYear,
      topic: 'Actualidad Regional',
      theme: 'editorial-calm',
      format,
      showSafeAreas: false,
      debug: false,
      scenes,
    };

    if (options.audioSrc) {
      videoProps.audio = {
        src: options.audioSrc,
        volume: options.audioVolume ?? 0.25,
        loop: true,
      };
    }

    return videoProps;
  }

  /**
   * Writes the video props to a JSON file for the Remotion CLI
   */
  public saveBatchProps(batch: BatchRecord, videoProps: NewsVideoProps): string {
    const batchOutDir = path.resolve(process.cwd(), 'out', 'batches', batch.id);
    fs.mkdirSync(batchOutDir, { recursive: true });

    const propsFile = path.join(batchOutDir, 'props.json');
    fs.writeFileSync(propsFile, JSON.stringify(videoProps, null, 2), 'utf-8');
    return propsFile;
  }
}
