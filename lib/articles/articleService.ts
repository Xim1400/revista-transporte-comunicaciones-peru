/**
 * Article Service
 * ================
 *
 * Única puerta de entrada que la UI usa para obtener artículos.
 *
 * La UI NUNCA importa `content/articles/*.json` ni `lib/content/repository`
 * directamente. Solo conoce este servicio. Esto permite reemplazar la
 * fuente de datos (JSON local → API → PostgreSQL → CMS) sin tocar ni un
 * componente de React.
 *
 * Reglas de negocio aplicadas aquí (no en el repositorio ni en la UI):
 *  - Solo se exponen artículos `published` a menos que se pida explícitamente.
 *  - Paginación y ordenado para listados.
 */
import { contentRepository } from "../content/repository";
import type {
  Article,
  ArticleFilters,
  CategorySlug,
  PaginatedResult,
} from "../types";

function paginate<T>(items: T[], page = 1, pageSize = 12): PaginatedResult<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}

export const articleService = {
  /** Todos los artículos publicados, opcionalmente filtrados. */
  getArticles(
    filters: Omit<ArticleFilters, "status"> = {},
    page = 1,
    pageSize = 12
  ): PaginatedResult<Article> {
    const articles = contentRepository.findAll({
      ...filters,
      status: "published",
    });
    return paginate(articles, page, pageSize);
  },

  getArticle(id: string): Article | null {
    const article = contentRepository.findById(id);
    return article && article.status === "published" ? article : null;
  },

  getArticleBySlug(slug: string): Article | null {
    const article = contentRepository.findBySlug(slug);
    return article && article.status === "published" ? article : null;
  },

  getFeaturedArticles(limit = 6): Article[] {
    return contentRepository
      .findAll({ status: "published" })
      .filter((a) => a.featured)
      .slice(0, limit);
  },

  getArticlesByCategory(
    category: CategorySlug,
    page = 1,
    pageSize = 12
  ): PaginatedResult<Article> {
    const articles = contentRepository.findAll({
      category,
      status: "published",
    });
    return paginate(articles, page, pageSize);
  },

  getLatestArticles(limit = 8): Article[] {
    return contentRepository.findAll({ status: "published" }).slice(0, limit);
  },

  getRelatedArticles(article: Article, limit = 3): Article[] {
    const published = contentRepository.findAll({ status: "published" });
    return published
      .filter((a) => a.slug !== article.slug)
      .map((a) => {
        let score = 0;
        if (a.category === article.category) score += 2;
        score += a.tags.filter((t) => article.tags.includes(t)).length;
        return { article: a, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((r) => r.article);
  },

  getAllTags(): string[] {
    const tags = new Set<string>();
    contentRepository
      .findAll({ status: "published" })
      .forEach((a) => a.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  },

  // Re-exportado para el módulo de búsqueda; mantiene toda lectura pasando
  // por el service en lugar de que cada módulo importe el repositorio.
  _getPublishedRaw(): Article[] {
    return contentRepository.findAll({ status: "published" });
  },
};
