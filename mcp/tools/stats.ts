import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { contentRepository } from "../../lib/content/repository.js";

function text(obj: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(obj, null, 2) }],
  };
}

export function registerStatsTools(server: McpServer) {
  server.registerTool(
    "get_article_statistics",
    {
      title: "Estadísticas de artículos",
      description:
        "Devuelve un resumen del estado del contenido: totales por estado, por categoría y artículos destacados.",
      inputSchema: {},
    },
    async () => {
      const all = contentRepository.findAll();

      const byStatus: Record<string, number> = {};
      const byCategory: Record<string, number> = {};
      let featured = 0;

      for (const article of all) {
        byStatus[article.status] = (byStatus[article.status] ?? 0) + 1;
        byCategory[article.category] = (byCategory[article.category] ?? 0) + 1;
        if (article.featured) featured += 1;
      }

      return text({
        total: all.length,
        byStatus,
        byCategory,
        featured,
        lastUpdated: all
          .map((a) => a.updatedAt ?? a.date)
          .sort()
          .at(-1),
      });
    }
  );
}
