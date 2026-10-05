/**
 * Search Service
 * ===============
 * Búsqueda simple por relevancia sobre el índice de artículos publicados.
 * Pensado para reemplazarse en el futuro por un motor externo (p. ej.
 * Meilisearch/Algolia) sin cambiar la firma pública `search()`.
 */
import { articleService } from "../articles/articleService";
import type { Article, CategorySlug, SearchResult } from "../types";

export interface SearchOptions {
  category?: CategorySlug;
  tag?: string;
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function scoreArticle(article: Article, terms: string[]): number {
  const title = normalize(article.title);
  const excerpt = normalize(article.excerpt);
  const category = normalize(article.category);
  const tags = article.tags.map(normalize);
  const content = normalize(article.content);

  let score = 0;
  for (const term of terms) {
    if (!term) continue;
    if (title.includes(term)) score += 5;
    if (title.startsWith(term)) score += 2;
    if (tags.some((t) => t.includes(term))) score += 3;
    if (category.includes(term)) score += 3;
    if (excerpt.includes(term)) score += 2;
    if (content.includes(term)) score += 1;
  }
  return score;
}

export const searchService = {
  search(query: string, options: SearchOptions = {}): SearchResult[] {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    let articles = articleService._getPublishedRaw();

    if (options.category) {
      articles = articles.filter((a) => a.category === options.category);
    }
    if (options.tag) {
      articles = articles.filter((a) =>
        a.tags.some((t) => normalize(t) === normalize(options.tag!))
      );
    }

    if (terms.length === 0) {
      return articles.map((article) => ({ article, score: 0 }));
    }

    return articles
      .map((article) => ({ article, score: scoreArticle(article, terms) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);
  },
};
