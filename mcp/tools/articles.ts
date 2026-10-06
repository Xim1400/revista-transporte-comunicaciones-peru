import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { randomUUID } from "node:crypto";
import { contentRepository } from "../../lib/content/repository.js";
import type { Article } from "../../lib/types.js";
import { categoryRepository } from "../services/categoryRepository.js";
import { slugify } from "../services/slug.js";
import { triggerRevalidate, articlePaths } from "../services/revalidate.js";
import {
  CreateArticleSchema,
  UpdateArticleSchema,
  SlugOnlySchema,
  GetArticleSchema,
  GetArticlesSchema,
} from "../schemas/article.js";

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

function assertCategoryExists(category: string) {
  if (!categoryRepository.exists(category)) {
    const known = categoryRepository
      .findAll()
      .map((c) => c.slug)
      .join(", ");
    throw new Error(
      `La categoría "${category}" no existe. Categorías disponibles: ${known}. Usa create_category para crear una nueva.`
    );
  }
}

export function registerArticleTools(server: McpServer) {
  server.registerTool(
    "get_articles",
    {
      title: "Listar artículos",
      description:
        "Lista artículos con filtros opcionales (estado, categoría, tag) y paginación. Por defecto NO filtra por estado (devuelve todos: draft, published y archived), para que la IA pueda revisar su propio trabajo pendiente de publicación.",
      inputSchema: GetArticlesSchema,
    },
    async ({ status, category, tag, page, pageSize }) => {
      const all = contentRepository.findAll({ status, category: category as never, tag });
      const start = (page - 1) * pageSize;
      const items = all.slice(start, start + pageSize);
      return text({
        total: all.length,
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil(all.length / pageSize)),
        items,
      });
    }
  );

  server.registerTool(
    "get_article",
    {
      title: "Obtener un artículo",
      description: "Obtiene un artículo por slug o por id, en cualquier estado.",
      inputSchema: GetArticleSchema,
    },
    async ({ slug, id }) => {
      if (!slug && !id) return errorResult("Debes indicar `slug` o `id`.");
      const article = slug
        ? contentRepository.findBySlug(slug)
        : contentRepository.findById(id!);
      if (!article) return errorResult("Artículo no encontrado.");
      return text(article);
    }
  );

  server.registerTool(
    "create_article",
    {
      title: "Crear artículo",
      description:
        "Crea un nuevo artículo en estado `draft`. NUNCA se publica automáticamente: requiere una llamada explícita a publish_article tras la revisión humana.",
      inputSchema: CreateArticleSchema,
    },
    async (input) => {
      try {
        assertCategoryExists(input.category);

        const slug = input.slug ?? slugify(input.title);
        if (!slug) return errorResult("No se pudo derivar un slug válido del título.");
        if (contentRepository.slugExists(slug)) {
          return errorResult(`Ya existe un artículo con el slug "${slug}".`);
        }

        const article: Article = {
          id: `art-${randomUUID().slice(0, 8)}`,
          slug,
          title: input.title,
          subtitle: input.subtitle,
          excerpt: input.excerpt,
          content: input.content,
          category: input.category as Article["category"],
          image: input.image,
          imageAlt: input.imageAlt,
          gallery: input.gallery,
          author: input.author,
          date: input.date ?? new Date().toISOString().slice(0, 10),
          tags: input.tags,
          featured: input.featured,
          status: "draft",
          demo: false,
        };

        const created = contentRepository.create(article);
        return text({
          message: `Artículo "${created.title}" creado en estado draft.`,
          article: created,
        });
      } catch (err) {
        return errorResult((err as Error).message);
      }
    }
  );

  server.registerTool(
    "update_article",
    {
      title: "Actualizar artículo",
      description: "Actualiza campos de un artículo existente (identificado por slug). No cambia su estado.",
      inputSchema: UpdateArticleSchema,
    },
    async ({ slug, ...patch }) => {
      try {
        if (patch.category) assertCategoryExists(patch.category);
        const previous = contentRepository.findBySlug(slug);
        const cleanPatch = Object.fromEntries(
          Object.entries(patch).filter(([, v]) => v !== undefined)
        );
        const updated = contentRepository.update(slug, cleanPatch as Partial<Article>);
        if (!updated) return errorResult(`No existe ningún artículo con slug "${slug}".`);
        const paths = articlePaths(updated);
        // Si cambió de categoría, el listado de la categoría anterior
        // también deja de incluir este artículo.
        if (previous && previous.category !== updated.category) {
          paths.push(`/${previous.category}`);
        }
        await triggerRevalidate(paths);
        return text({ message: "Artículo actualizado.", article: updated });
      } catch (err) {
        return errorResult((err as Error).message);
      }
    }
  );

  server.registerTool(
    "delete_article",
    {
      title: "Eliminar artículo",
      description: "Elimina permanentemente un artículo por slug. Operación irreversible.",
      inputSchema: SlugOnlySchema,
    },
    async ({ slug }) => {
      const existing = contentRepository.findBySlug(slug);
      const deleted = contentRepository.delete(slug);
      if (!deleted) return errorResult(`No existe ningún artículo con slug "${slug}".`);
      if (existing) await triggerRevalidate(articlePaths(existing));
      return text({ message: `Artículo "${slug}" eliminado.` });
    }
  );

  server.registerTool(
    "publish_article",
    {
      title: "Publicar artículo",
      description:
        "Publica un artículo en estado draft o archived, haciéndolo visible en la revista. Usar solo tras revisión humana del contenido.",
      inputSchema: SlugOnlySchema,
    },
    async ({ slug }) => {
      const updated = contentRepository.setStatus(slug, "published");
      if (!updated) return errorResult(`No existe ningún artículo con slug "${slug}".`);
      await triggerRevalidate(articlePaths(updated));
      return text({ message: `Artículo "${slug}" publicado.`, article: updated });
    }
  );

  server.registerTool(
    "unpublish_article",
    {
      title: "Despublicar artículo",
      description: "Retira un artículo publicado, devolviéndolo a estado draft. Deja de verse en la revista.",
      inputSchema: SlugOnlySchema,
    },
    async ({ slug }) => {
      const updated = contentRepository.setStatus(slug, "draft");
      if (!updated) return errorResult(`No existe ningún artículo con slug "${slug}".`);
      await triggerRevalidate(articlePaths(updated));
      return text({ message: `Artículo "${slug}" despublicado (vuelve a draft).`, article: updated });
    }
  );
}
