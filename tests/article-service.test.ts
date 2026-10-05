import { describe, it, expect } from "vitest";
import { articleService } from "../lib/articles/articleService";

describe("articleService", () => {
  it("solo devuelve artículos publicados", () => {
    const { items } = articleService.getArticles({}, 1, 50);
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((a) => a.status === "published")).toBe(true);
  });

  it("pagina correctamente", () => {
    const page1 = articleService.getArticles({}, 1, 5);
    const page2 = articleService.getArticles({}, 2, 5);
    expect(page1.items).toHaveLength(5);
    expect(page1.page).toBe(1);
    expect(page1.items[0].slug).not.toBe(page2.items[0].slug);
  });

  it("getArticleBySlug devuelve null si no existe", () => {
    expect(articleService.getArticleBySlug("no-existe-xyz")).toBeNull();
  });

  it("getArticleBySlug devuelve el artículo correcto", () => {
    const article = articleService.getArticleBySlug(
      "linea-2-metro-lima-nuevo-tramo"
    );
    expect(article).not.toBeNull();
    expect(article?.category).toBe("transporte");
  });

  it("getFeaturedArticles solo devuelve artículos marcados como destacados", () => {
    const featured = articleService.getFeaturedArticles(10);
    expect(featured.every((a) => a.featured)).toBe(true);
  });

  it("getArticlesByCategory filtra por categoría", () => {
    const { items } = articleService.getArticlesByCategory("telecomunicaciones", 1, 50);
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((a) => a.category === "telecomunicaciones")).toBe(true);
  });

  it("getRelatedArticles nunca incluye el propio artículo", () => {
    const article = articleService.getArticleBySlug(
      "linea-2-metro-lima-nuevo-tramo"
    )!;
    const related = articleService.getRelatedArticles(article);
    expect(related.some((a) => a.slug === article.slug)).toBe(false);
  });
});
