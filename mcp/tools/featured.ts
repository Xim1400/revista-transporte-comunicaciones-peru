import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { contentRepository } from "../../lib/content/repository.js";
import { SetFeaturedSchema } from "../schemas/article.js";
import { triggerRevalidate } from "../services/revalidate.js";

function text(obj: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(obj, null, 2) }],
  };
}

function errorResult(message: string) {
  return {
    isError: true,
    content: [{ type: "text" as const, text: message }],
  };
}

export function registerFeaturedTools(server: McpServer) {
  server.registerTool(
    "get_featured_articles",
    {
      title: "Listar artículos destacados",
      description: "Lista los artículos actualmente marcados como destacados (featured) y publicados.",
      inputSchema: {},
    },
    async () => {
      const featured = contentRepository
        .findAll({ status: "published" })
        .filter((a) => a.featured);
      return text({ total: featured.length, items: featured });
    }
  );

  server.registerTool(
    "set_featured_article",
    {
      title: "Destacar artículo",
      description: "Marca un artículo como destacado (aparecerá en el carrusel de la homepage si está publicado).",
      inputSchema: SetFeaturedSchema,
    },
    async ({ slug }) => {
      const updated = contentRepository.setFeatured(slug, true);
      if (!updated) return errorResult(`No existe ningún artículo con slug "${slug}".`);
      await triggerRevalidate(["/"]);
      return text({ message: `Artículo "${slug}" marcado como destacado.`, article: updated });
    }
  );

  server.registerTool(
    "remove_featured_article",
    {
      title: "Quitar destacado",
      description: "Quita la marca de destacado de un artículo.",
      inputSchema: SetFeaturedSchema,
    },
    async ({ slug }) => {
      const updated = contentRepository.setFeatured(slug, false);
      if (!updated) return errorResult(`No existe ningún artículo con slug "${slug}".`);
      await triggerRevalidate(["/"]);
      return text({ message: `Artículo "${slug}" ya no está destacado.`, article: updated });
    }
  );
}
