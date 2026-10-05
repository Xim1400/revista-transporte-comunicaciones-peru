/**
 * Content Repository
 * ===================
 *
 * Única capa que toca el almacenamiento físico de las noticias.
 *
 * Fuente de datos actual: un archivo JSON por artículo en /content/articles.
 *
 * Tanto el Article Service (consumido por la UI) como el MCP (consumido por
 * la IA) dependen EXCLUSIVAMENTE de este módulo para leer/escribir
 * contenido. Ninguno de los dos sabe —ni debe saber— que los datos viven en
 * archivos JSON locales. El día que esto pase a ser una API REST o una base
 * de datos PostgreSQL, solo este archivo cambia.
 *
 * Node-only: usa `fs`. No importar desde Client Components.
 */
import fs from "node:fs";
import path from "node:path";
import type { Article, ArticleFilters, ArticleStatus } from "../types";

// Permite anular la ubicación del contenido (útil para Docker/MCP cuando
// el proceso no arranca con cwd = raíz del proyecto). Se resuelve de forma
// perezosa (no en un `const` de nivel de módulo) para que funcione aunque
// la variable de entorno se defina después de importar este módulo.
function articlesDir(): string {
  return (
    process.env.CONTENT_ARTICLES_DIR ??
    path.join(process.cwd(), "content", "articles")
  );
}

function ensureDir() {
  const dir = articlesDir();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function filePath(slug: string): string {
  return path.join(articlesDir(), `${slug}.json`);
}

function readAllSync(): Article[] {
  ensureDir();
  const dir = articlesDir();
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  const articles: Article[] = [];
  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      articles.push(JSON.parse(raw) as Article);
    } catch {
      // Ignora archivos corruptos en lugar de romper toda la revista.
      continue;
    }
  }
  return articles;
}

function sortByDateDesc(articles: Article[]): Article[] {
  return [...articles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export interface ContentRepository {
  findAll(filters?: ArticleFilters): Article[];
  findBySlug(slug: string): Article | null;
  findById(id: string): Article | null;
  create(article: Article): Article;
  update(slug: string, patch: Partial<Article>): Article | null;
  delete(slug: string): boolean;
  setStatus(slug: string, status: ArticleStatus): Article | null;
  setFeatured(slug: string, featured: boolean): Article | null;
  slugExists(slug: string): boolean;
}

export const contentRepository: ContentRepository = {
  findAll(filters) {
    let articles = readAllSync();

    if (filters?.status) {
      articles = articles.filter((a) => a.status === filters.status);
    }
    if (filters?.category) {
      articles = articles.filter((a) => a.category === filters.category);
    }
    if (filters?.tag) {
      articles = articles.filter((a) =>
        a.tags?.some((t) => t.toLowerCase() === filters.tag!.toLowerCase())
      );
    }
    if (filters?.from) {
      const from = new Date(filters.from).getTime();
      articles = articles.filter((a) => new Date(a.date).getTime() >= from);
    }
    if (filters?.to) {
      const to = new Date(filters.to).getTime();
      articles = articles.filter((a) => new Date(a.date).getTime() <= to);
    }

    return sortByDateDesc(articles);
  },

  findBySlug(slug) {
    ensureDir();
    const fp = filePath(slug);
    if (!fs.existsSync(fp)) return null;
    try {
      return JSON.parse(fs.readFileSync(fp, "utf-8")) as Article;
    } catch {
      return null;
    }
  },

  findById(id) {
    return readAllSync().find((a) => a.id === id) ?? null;
  },

  create(article) {
    ensureDir();
    const fp = filePath(article.slug);
    if (fs.existsSync(fp)) {
      throw new Error(`Ya existe un artículo con el slug "${article.slug}".`);
    }
    fs.writeFileSync(fp, JSON.stringify(article, null, 2) + "\n", "utf-8");
    return article;
  },

  update(slug, patch) {
    const current = this.findBySlug(slug);
    if (!current) return null;

    const updated: Article = {
      ...current,
      ...patch,
      slug: current.slug, // el slug no se muta en update(); usar rename si se requiere.
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(
      filePath(slug),
      JSON.stringify(updated, null, 2) + "\n",
      "utf-8"
    );
    return updated;
  },

  delete(slug) {
    const fp = filePath(slug);
    if (!fs.existsSync(fp)) return false;
    fs.unlinkSync(fp);
    return true;
  },

  setStatus(slug, status) {
    return this.update(slug, { status });
  },

  setFeatured(slug, featured) {
    return this.update(slug, { featured });
  },

  slugExists(slug) {
    return fs.existsSync(filePath(slug));
  },
};
