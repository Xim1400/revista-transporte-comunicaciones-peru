import { describe, it, expect } from "vitest";
import { searchService } from "../lib/search/searchService";

describe("searchService", () => {
  it("encuentra resultados por término del título", () => {
    const results = searchService.search("5G");
    expect(results.length).toBeGreaterThan(0);
    expect(
      results.some((r) => r.article.title.toLowerCase().includes("5g"))
    ).toBe(true);
  });

  it("ordena por relevancia (score descendente)", () => {
    const results = searchService.search("puerto");
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });

  it("filtra por categoría", () => {
    const results = searchService.search("red", { category: "telecomunicaciones" });
    expect(results.every((r) => r.article.category === "telecomunicaciones")).toBe(true);
  });

  it("ignora tildes y mayúsculas", () => {
    const results = searchService.search("ELÉCTRICOS");
    expect(results.length).toBeGreaterThan(0);
  });

  it("devuelve un array vacío para términos sin coincidencias", () => {
    const results = searchService.search("xyznoexistenada123");
    expect(results).toHaveLength(0);
  });
});
