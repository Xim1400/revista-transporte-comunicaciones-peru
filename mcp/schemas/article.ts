/**
 * Esquemas Zod para las herramientas MCP de artículos.
 *
 * Regla de seguridad: nunca confiar ciegamente en los datos que propone la
 * IA. Todo payload que llega a una tool pasa primero por estos esquemas; la
 * tool solo ve datos ya validados y con tipos correctos.
 */
import { z } from "zod";
import { SLUG_REGEX } from "../services/slug.js";

export const slugField = z
  .string()
  .min(3, "El slug debe tener al menos 3 caracteres.")
  .max(80, "El slug no puede superar 80 caracteres.")
  .regex(
    SLUG_REGEX,
    "El slug solo puede contener minúsculas, números y guiones (ej.: 'nuevo-avance-5g')."
  );

export const tagsField = z
  .array(z.string().min(1).max(40))
  .min(1, "Debe incluir al menos un tag.")
  .max(12, "Máximo 12 tags por artículo.");

export const imageRefField = z
  .string()
  .min(1, "La imagen es obligatoria.")
  .refine(
    (v) => v.startsWith("/images/") || /^https?:\/\//.test(v),
    "La imagen debe ser una ruta local ('/images/...') o una URL http(s) válida."
  );

export const isoDateField = z
  .string()
  .refine((v) => !Number.isNaN(new Date(v).getTime()), "Fecha inválida.");

export const CreateArticleSchema = {
  title: z.string().min(8, "El título debe tener al menos 8 caracteres.").max(180),
  slug: slugField.optional().describe(
    "Slug de la URL. Si se omite, se genera automáticamente a partir del título."
  ),
  subtitle: z.string().max(200).optional(),
  excerpt: z
    .string()
    .min(20, "El extracto debe tener al menos 20 caracteres.")
    .max(400),
  content: z
    .string()
    .min(80, "El contenido debe tener al menos 80 caracteres."),
  category: z
    .string()
    .min(1, "La categoría es obligatoria.")
    .describe("Slug de una categoría existente. Usa get_categories para ver las disponibles."),
  image: imageRefField,
  imageAlt: z.string().max(200).optional(),
  gallery: z.array(imageRefField).max(10).optional(),
  author: z.string().min(2).max(80).default("Redacción"),
  date: isoDateField.optional().describe("ISO 8601. Por defecto, la fecha actual."),
  tags: tagsField,
  featured: z.boolean().default(false),
};

export const UpdateArticleSchema = {
  slug: slugField.describe("Slug del artículo a actualizar."),
  title: z.string().min(8).max(180).optional(),
  subtitle: z.string().max(200).optional(),
  excerpt: z.string().min(20).max(400).optional(),
  content: z.string().min(80).optional(),
  category: z.string().min(1).optional(),
  image: imageRefField.optional(),
  imageAlt: z.string().max(200).optional(),
  gallery: z.array(imageRefField).max(10).optional(),
  author: z.string().min(2).max(80).optional(),
  date: isoDateField.optional(),
  tags: tagsField.optional(),
};

export const SlugOnlySchema = {
  slug: slugField,
};

export const GetArticleSchema = {
  slug: slugField.optional(),
  id: z.string().optional(),
}; // valida a nivel de tool que al menos uno esté presente.

export const GetArticlesSchema = {
  status: z.enum(["draft", "published", "archived"]).optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(50).default(12),
};

export const SearchArticlesSchema = {
  query: z.string().min(1, "La búsqueda no puede estar vacía."),
  category: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
};

export const SetFeaturedSchema = {
  slug: slugField,
};

export const CreateCategorySchema = {
  slug: slugField,
  name: z.string().min(2).max(60),
  description: z.string().min(10).max(300),
};

export const UploadImageSchema = {
  filename: z
    .string()
    .min(3)
    .max(120)
    .regex(/^[a-zA-Z0-9.\-_]+\.(jpg|jpeg|png|webp|svg)$/i, "Nombre de archivo inválido."),
  base64Data: z.string().min(10, "El contenido de la imagen es obligatorio."),
  altText: z.string().max(200).optional(),
};

export const FetchImageFromUrlSchema = {
  url: z
    .string()
    .url("Debe ser una URL http(s) válida.")
    .refine((v) => /^https?:\/\//.test(v), "Solo se permiten URLs http(s)."),
  filename: z
    .string()
    .min(3)
    .max(120)
    .regex(/^[a-zA-Z0-9.\-_]+\.(jpg|jpeg|png|webp|svg)$/i, "Nombre de archivo inválido."),
  altText: z.string().max(200).optional(),
  attribution: z
    .string()
    .max(300)
    .optional()
    .describe(
      "Crédito/licencia de la imagen (ej. 'Foto: Juan Pérez, Wikimedia Commons, CC BY-SA 4.0'). Obligatorio si la licencia de origen exige atribución."
    ),
};
