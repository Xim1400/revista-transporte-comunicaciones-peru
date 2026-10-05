import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { contentRepository } from "../../lib/content/repository.js";
import { SearchArticlesSchema } from "../schemas/article.js";

function text(obj: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(obj, null, 2) }],
  };
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function registerSearchTools(server: McpServer) {
  server.registerTool(
    "search_articles",
    {
      title: "Buscar artículos",
      description:
        "Busca artículos por texto libre (título, extracto, categoría, tags, contenido), con filtros opcionales de categoría y estado.",
      inputSchema: SearchArticlesSchema,
    },
    async ({ query, category, status }) => {
      const terms = normalize(query).split(/\s+/).filter(Boolean);
      const articles = contentRepository.findAll({
        category: category as never,
        status,
      });

      const scored = articles
        .map((article) => {
          const title = normalize(article.title);
          const excerpt = normalize(article.excerpt);
          const tags = article.tags.map(normalize);
          let score = 0;
          for (const term of terms) {
            if (title.includes(term)) score += 5;
            if (tags.some((t) => t.includes(term))) score += 3;
            if (excerpt.includes(term)) score += 2;
          }
          return { article, score };
        })
        .filter((r) => r.score > 0)
        .sort((a, b) => b.score - a.score);

      return text({
        total: scored.length,
        results: scored.map((r) => ({ score: r.score, article: r.article })),
      });
    }
  );
}
