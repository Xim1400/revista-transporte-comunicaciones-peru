/**
 * Modelo de contenido central de la revista.
 *
 * Este tipo es el contrato compartido entre:
 *  - La UI (vía Article Service)
 *  - El MCP (vía Content Repository)
 *
 * Cualquier fuente de datos futura (Markdown, API, PostgreSQL, CMS) debe
 * poder mapearse a este mismo modelo sin tocar la UI ni el MCP.
 */

export const CATEGORIES = [
  "transporte",
  "aeropuertos",
  "puertos",
  "telecomunicaciones",
  "infraestructura",
] as const;

export type CategorySlug = (typeof CATEGORIES)[number];

export interface CategoryInfo {
  slug: CategorySlug;
  name: string;
  description: string;
}

export const CATEGORY_INFO: Record<CategorySlug, CategoryInfo> = {
  transporte: {
    slug: "transporte",
    name: "Transporte",
    description:
      "Transporte terrestre y ferroviario: carreteras, buses, trenes, movilidad urbana y logística de carga en el Perú.",
  },
  aeropuertos: {
    slug: "aeropuertos",
    name: "Aeropuertos",
    description:
      "Transporte aéreo, aeropuertos, aerolíneas y aviación civil y comercial en el Perú.",
  },
  puertos: {
    slug: "puertos",
    name: "Puertos",
    description:
      "Transporte marítimo y fluvial, puertos, terminales portuarias y logística de comercio exterior.",
  },
  telecomunicaciones: {
    slug: "telecomunicaciones",
    name: "Telecomunicaciones",
    description:
      "5G, fibra óptica, internet, satélites, operadores, redes y conectividad en el Perú.",
  },
  infraestructura: {
    slug: "infraestructura",
    name: "Infraestructura",
    description:
      "Obras públicas, infraestructura vial, ferroviaria, portuaria, aeroportuaria y de telecomunicaciones.",
  },
};

export type ArticleStatus = "draft" | "published" | "archived";

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  content: string;
  category: CategorySlug;
  date: string;
  updatedAt?: string;
  author: string;
  image: string;
  imageAlt?: string;
  gallery?: string[];
  featured: boolean;
  status: ArticleStatus;
  tags: string[];
  /** Marca contenido de demostración, para no confundirlo con noticias reales. */
  demo?: boolean;
}

/** Artículo publicado tal como lo consume la UI pública. */
export type PublishedArticle = Article & { status: "published" };

export interface SearchResult {
  article: Article;
  score: number;
}

export interface ArticleFilters {
  category?: CategorySlug;
  tag?: string;
  from?: string;
  to?: string;
  query?: string;
  status?: ArticleStatus;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
