import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { categoryRepository } from "../services/categoryRepository.js";
import { CreateCategorySchema } from "../schemas/article.js";

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

export function registerCategoryTools(server: McpServer) {
  server.registerTool(
    "get_categories",
    {
      title: "Listar categorías",
      description:
        "Lista todas las categorías disponibles para usar en create_article/update_article. Incluye las 5 secciones principales de la revista (transporte, aeropuertos, puertos, telecomunicaciones, infraestructura) y cualquier categoría adicional creada con create_category.",
      inputSchema: {},
    },
    async () => text({ categories: categoryRepository.findAll() })
  );

  server.registerTool(
    "create_category",
    {
      title: "Crear categoría",
      description:
        "Registra una nueva categoría para clasificar artículos. TRANS&TEL es una revista especializada en transporte y comunicaciones del Perú: usa esta herramienta solo para subtemas de ese ámbito (p. ej. 'ferrocarriles', 'movilidad-urbana'), nunca para secciones genéricas ajenas al sector (economía general, opinión, tecnología no relacionada, etc.). Nota: solo las 5 categorías principales (transporte, aeropuertos, puertos, telecomunicaciones, infraestructura) tienen una sección dedicada en la navegación de la revista; las categorías adicionales son utilizables en artículos y búsqueda, pero no generan automáticamente una nueva sección en la UI.",
      inputSchema: CreateCategorySchema,
    },
    async ({ slug, name, description }) => {
      try {
        const created = categoryRepository.create({
          slug,
          name,
          description,
          builtin: false,
        });
        return text({ message: `Categoría "${name}" creada.`, category: created });
      } catch (err) {
        return errorResult((err as Error).message);
      }
    }
  );
}
