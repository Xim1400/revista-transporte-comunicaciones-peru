import type { MetadataRoute } from "next";
import { contentRepository } from "@/lib/content/repository";
import { CATEGORIES } from "@/lib/types";
import { SITE } from "@/lib/site";

// El sitemap no necesita frescura al segundo; el MCP lo invalida igual
// tras publicar, esto es solo el respaldo.
export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE.url, changeFrequency: "hourly", priority: 1 },
    ...CATEGORIES.map((c) => ({
      url: `${SITE.url}/${c}`,
      changeFrequency: "hourly" as const,
      priority: 0.8,
    })),
    { url: `${SITE.url}/buscar`, changeFrequency: "weekly", priority: 0.3 },
    { url: `${SITE.url}/sobre-nosotros`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE.url}/contacto`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const articleRoutes: MetadataRoute.Sitemap = contentRepository
    .findAll({ status: "published" })
    .map((article) => ({
      url: `${SITE.url}/noticias/${article.slug}`,
      lastModified: article.updatedAt ?? article.date,
      changeFrequency: "daily" as const,
      priority: 0.6,
    }));

  return [...staticRoutes, ...articleRoutes];
}
