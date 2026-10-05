/**
 * Category Repository
 * ====================
 * Las 5 categorías principales (transporte, aeropuertos, puertos,
 * telecomunicaciones, infraestructura) son fijas en el frontend porque cada
 * una tiene su propia ruta/sección editorial (ver /app/<categoria>).
 *
 * Este repositorio permite, además, registrar categorías adicionales desde
 * el MCP (p. ej. subtemas) que los artículos pueden usar como `category`
 * aunque todavía no tengan una sección dedicada en la UI. Se persisten en
 * content/categories.json, sembrado inicialmente con las 5 categorías base.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CATEGORIES, CATEGORY_INFO } from "../../lib/types.js";

const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));

export interface CategoryRecord {
  slug: string;
  name: string;
  description: string;
  /** true para las 6 categorías con sección propia en la UI. */
  builtin: boolean;
}

// mcp/services/categoryRepository.ts -> ../../content/categories.json
// (resuelto desde la ubicación del módulo, no del cwd del proceso, para
// que el MCP funcione igual arrancado desde /mcp o desde la raíz del repo).
const FILE =
  process.env.CONTENT_CATEGORIES_FILE ??
  path.join(MODULE_DIR, "..", "..", "content", "categories.json");

function resolveFile(): string {
  return FILE;
}

function seedIfMissing(): void {
  const file = resolveFile();
  if (fs.existsSync(file)) return;
  const seed: CategoryRecord[] = CATEGORIES.map((slug) => ({
    ...CATEGORY_INFO[slug],
    builtin: true,
  }));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(seed, null, 2) + "\n", "utf-8");
}

function readAll(): CategoryRecord[] {
  seedIfMissing();
  const file = resolveFile();
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

export const categoryRepository = {
  findAll(): CategoryRecord[] {
    return readAll();
  },

  findBySlug(slug: string): CategoryRecord | null {
    return readAll().find((c) => c.slug === slug) ?? null;
  },

  exists(slug: string): boolean {
    return this.findBySlug(slug) !== null;
  },

  create(record: CategoryRecord): CategoryRecord {
    const all = readAll();
    if (all.some((c) => c.slug === record.slug)) {
      throw new Error(`Ya existe la categoría "${record.slug}".`);
    }
    all.push(record);
    fs.writeFileSync(resolveFile(), JSON.stringify(all, null, 2) + "\n", "utf-8");
    return record;
  },
};
