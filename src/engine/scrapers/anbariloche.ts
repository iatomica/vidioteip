import { BaseScraper } from './base';
import { RawArticle } from '../types';

export class ANBarilocheScraper extends BaseScraper {
  name = 'anbariloche';
  displayName = 'ANBariloche';
  private baseUrl = 'https://www.anbariloche.com.ar';

  constructor(customBaseUrl?: string) {
    super();
    if (customBaseUrl) {
      this.baseUrl = customBaseUrl.replace(/\/+$/, '');
    }
  }

  private headers = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'es-AR,es;q=0.9,en;q=0.8',
  };

  async fetchLatestArticles(): Promise<RawArticle[]> {
    console.log(`[ANBarilocheScraper] Fetching homepage from ${this.baseUrl}...`);

    let homeHtml = '';
    try {
      const res = await fetch(this.baseUrl, { headers: this.headers });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }
      homeHtml = await res.text();
    } catch (e: any) {
      console.error(`[ANBarilocheScraper] Failed to fetch homepage: ${e.message}`);
      return [];
    }

    // Extract all article URLs matching /noticias/YYYY/MM/DD/{id}-{slug}
    const regex = /href=["'](\/noticias\/\d{4}\/\d{2}\/\d{2}\/(\d+)-[^"']+)["']/gi;
    const candidates: { url: string; externalId: string }[] = [];
    const seenIds = new Set<string>();

    let match;
    while ((match = regex.exec(homeHtml)) !== null) {
      const relativePath = match[1];
      const externalId = match[2];

      if (!seenIds.has(externalId)) {
        seenIds.add(externalId);
        candidates.push({
          url: `${this.baseUrl}${relativePath}`,
          externalId,
        });
      }
    }

    console.log(`[ANBarilocheScraper] Discovered ${candidates.length} candidate article URLs on homepage.`);

    // Fetch details for candidates with concurrency control (max 4 parallel)
    const articles: RawArticle[] = [];
    const MAX_CONCURRENT = 4;

    for (let i = 0; i < candidates.length; i += MAX_CONCURRENT) {
      const chunk = candidates.slice(i, i + MAX_CONCURRENT);
      const results = await Promise.all(
        chunk.map(async (candidate) => this.fetchArticleDetails(candidate.url, candidate.externalId))
      );

      for (const res of results) {
        if (res) {
          articles.push(res);
        }
      }
    }

    console.log(`[ANBarilocheScraper] Successfully extracted ${articles.length} valid news items.`);
    return articles;
  }

  private async fetchArticleDetails(url: string, externalId: string): Promise<RawArticle | null> {
    try {
      const res = await fetch(url, { headers: this.headers });
      if (!res.ok) return null;
      const html = await res.text();

      // Extract OpenGraph tags
      const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/i);
      const ogDescMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i);
      const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["'](.*?)["']/i);
      const sectionMatch = html.match(/<meta\s+property=["']article:section["']\s+content=["'](.*?)["']/i);

      if (!ogTitleMatch || !ogTitleMatch[1]) return null;

      const title = this.cleanText(ogTitleMatch[1]);
      const subtitle = ogDescMatch && ogDescMatch[1] ? this.cleanText(ogDescMatch[1]) : '';
      const imageUrl = ogImageMatch && ogImageMatch[1] ? ogImageMatch[1].trim() : '';

      // Quality validations:
      // 1. Must have high-quality photo
      if (!imageUrl || !imageUrl.startsWith('http')) return null;

      // 2. Title must be substantive
      if (title.length < 15) return null;

      // 3. Subtitle should preferably be non-empty
      if (subtitle.length < 10) return null;

      // Determine category (e.g. INFRAESTRUCTURA, CULTURA, TURISMO, JUDICIALES, POLICIALES, COMUNIDAD)
      let category = sectionMatch && sectionMatch[1] ? sectionMatch[1].toUpperCase() : 'BARILOCHE';
      if (category === 'NOTICIAS' || category === 'DEFAULT') {
        category = this.inferCategory(title, subtitle);
      }

      return {
        portalId: this.name,
        externalId,
        url,
        title,
        subtitle,
        imageUrl,
        category,
        source: 'ANBARILOCHE.COM.AR',
        date: new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }).toUpperCase(),
      };
    } catch (e) {
      return null;
    }
  }

  private inferCategory(title: string, subtitle: string): string {
    const text = `${title} ${subtitle}`.toLowerCase();
    if (text.includes('aeropuerto') || text.includes('obra') || text.includes('ruta') || text.includes('pavimento') || text.includes('gas') || text.includes('agua')) {
      return 'INFRAESTRUCTURA';
    }
    if (text.includes('turismo') || text.includes('catedral') || text.includes('esquí') || text.includes('vuelo') || text.includes('temporada')) {
      return 'TURISMO';
    }
    if (text.includes('juicio') || text.includes('imputaron') || text.includes('fiscal') || text.includes('condena') || text.includes('juez') || text.includes('cautelar')) {
      return 'JUDICIALES';
    }
    if (text.includes('polic') || text.includes('deten') || text.includes('robo') || text.includes('arma') || text.includes('accidente') || text.includes('choque')) {
      return 'POLICIALES';
    }
    if (text.includes('festival') || text.includes('música') || text.includes('teatro') || text.includes('arte') || text.includes('cultura')) {
      return 'CULTURA';
    }
    if (text.includes('escuela') || text.includes('universidad') || text.includes('docente') || text.includes('estudiante') || text.includes('educación')) {
      return 'EDUCACIÓN';
    }
    if (text.includes('clima') || text.includes('nieve') || text.includes('lluvia') || text.includes('alerta') || text.includes('viento')) {
      return 'METEOROLOGÍA';
    }
    return 'ACTUALIDAD';
  }
}
