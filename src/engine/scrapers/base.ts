import { RawArticle, ScraperProvider } from '../types';

export abstract class BaseScraper implements ScraperProvider {
  abstract name: string;
  abstract displayName: string;

  abstract fetchLatestArticles(): Promise<RawArticle[]>;

  protected cleanText(text: string): string {
    return text
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
