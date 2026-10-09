import { describe, it, expect, afterAll } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// Aísla este test en un directorio temporal: nunca debe tocar las
// noticias de demostración reales de /content/articles.
const TMP_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "rptc-test-"));
process.env.CONTENT_ARTICLES_DIR = TMP_DIR;

const { contentRepository } = await import("../lib/content/repository");
const BASE_ARTICLE = {
  id: "art-test-1",
  slug: "articulo-de-prueba",
  title: "Artículo de prueba para tests",
  excerpt: "Extracto de prueba para los tests automatizados.",
  content: "Contenido de prueba.",
  category: "infraestructura" as const,
  date: "2026-01-01",
  author: "Tester",
  image: "/images/placeholder.svg",
  featured: false,
  status: "draft" as const,
  tags: ["test"],
};

describe("contentRepository (estados draft/published/archived)", () => {
  afterAll(() => {
    fs.rmSync(TMP_DIR, { recursive: true, force: true });
  });

  it("crea un artículo en estado draft", () => {
    const created = contentRepository.create(BASE_ARTICLE);
    expect(created.status).toBe("draft");
  });

  it("no permite crear dos artículos con el mismo slug", () => {
    expect(() => contentRepository.create(BASE_ARTICLE)).toThrow();
  });

  it("findBySlug recupera el artículo creado", () => {
    const found = contentRepository.findBySlug(BASE_ARTICLE.slug);
    expect(found?.title).toBe(BASE_ARTICLE.title);
  });

  it("setStatus publica el artículo", () => {
    const updated = contentRepository.setStatus(BASE_ARTICLE.slug, "published");
    expect(updated?.status).toBe("published");
  });

  it("update() modifica campos y actualiza updatedAt", () => {
    const updated = contentRepository.update(BASE_ARTICLE.slug, {
      title: "Título actualizado",
    });
    expect(updated?.title).toBe("Título actualizado");
    expect(updated?.updatedAt).toBeTruthy();
  });

  it("setFeatured marca y desmarca destacados", () => {
    const featured = contentRepository.setFeatured(BASE_ARTICLE.slug, true);
    expect(featured?.featured).toBe(true);
    const unfeatured = contentRepository.setFeatured(BASE_ARTICLE.slug, false);
    expect(unfeatured?.featured).toBe(false);
  });

  it("setStatus despublica el artículo (vuelve a draft)", () => {
    const updated = contentRepository.setStatus(BASE_ARTICLE.slug, "draft");
    expect(updated?.status).toBe("draft");
  });

  it("delete() elimina el artículo y deja de encontrarse", () => {
    const deleted = contentRepository.delete(BASE_ARTICLE.slug);
    expect(deleted).toBe(true);
    expect(contentRepository.findBySlug(BASE_ARTICLE.slug)).toBeNull();
  });

  it("delete() devuelve false para un slug inexistente", () => {
    expect(contentRepository.delete("no-existe")).toBe(false);
  });
});
