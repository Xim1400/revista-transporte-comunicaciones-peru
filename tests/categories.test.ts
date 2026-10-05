import { describe, it, expect } from "vitest";
import { categoryService } from "../lib/categories/categories";
import { CATEGORIES } from "../lib/types";

describe("categoryService", () => {
  it("expone las 5 categorías principales", () => {
    expect(categoryService.getCategories()).toHaveLength(5);
  });

  it("valida slugs de categoría conocidos", () => {
    for (const slug of CATEGORIES) {
      expect(categoryService.isValidCategory(slug)).toBe(true);
    }
  });

  it("rechaza slugs desconocidos", () => {
    expect(categoryService.isValidCategory("deportes")).toBe(false);
  });

  it("getCategory devuelve null para slugs inválidos", () => {
    expect(categoryService.getCategory("inventado")).toBeNull();
  });
});
