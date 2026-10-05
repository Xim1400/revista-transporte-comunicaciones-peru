import { describe, it, expect } from "vitest";
import { z } from "zod";
import { slugify, isValidSlug } from "../mcp/services/slug";
import { CreateArticleSchema, UploadImageSchema } from "../mcp/schemas/article";

const CreateArticle = z.object(CreateArticleSchema);
const UploadImage = z.object(UploadImageSchema);

describe("slug utils", () => {
  it("slugify normaliza tildes, espacios y mayúsculas", () => {
    expect(slugify("¡Llegó el 5G a la Región Norte!")).toBe(
      "llego-el-5g-a-la-region-norte"
    );
  });

  it("isValidSlug acepta slugs bien formados", () => {
    expect(isValidSlug("nuevo-avance-5g")).toBe(true);
  });

  it("isValidSlug rechaza mayúsculas, espacios y símbolos", () => {
    expect(isValidSlug("Nuevo Avance")).toBe(false);
    expect(isValidSlug("nuevo_avance")).toBe(false);
    expect(isValidSlug("nuevo--")).toBe(false);
  });
});

describe("CreateArticleSchema (validación de create_article)", () => {
  const valid = {
    title: "Un título de prueba suficientemente largo",
    excerpt: "Un extracto de prueba con más de veinte caracteres.",
    content: "Contenido de prueba con una longitud mínima suficiente para pasar la validación del esquema.",
    category: "infraestructura",
    image: "/images/foo.svg",
    tags: ["IA"],
  };

  it("acepta un payload válido", () => {
    expect(() => CreateArticle.parse(valid)).not.toThrow();
  });

  it("rechaza título demasiado corto", () => {
    expect(() => CreateArticle.parse({ ...valid, title: "Corto" })).toThrow();
  });

  it("rechaza contenido vacío", () => {
    expect(() => CreateArticle.parse({ ...valid, content: "" })).toThrow();
  });

  it("rechaza imagen que no es ruta local ni URL http(s)", () => {
    expect(() =>
      CreateArticle.parse({ ...valid, image: "ftp://ejemplo.com/img.jpg" })
    ).toThrow();
  });

  it("rechaza un slug con mayúsculas si se provee explícitamente", () => {
    expect(() => CreateArticle.parse({ ...valid, slug: "No Valido" })).toThrow();
  });

  it("rechaza tags vacíos", () => {
    expect(() => CreateArticle.parse({ ...valid, tags: [] })).toThrow();
  });

  it("aplica el autor por defecto cuando se omite", () => {
    const parsed = CreateArticle.parse(valid);
    expect(parsed.author).toBe("Redacción TRANS&TEL");
  });
});

describe("UploadImageSchema", () => {
  it("rechaza extensiones de archivo no soportadas", () => {
    expect(() =>
      UploadImage.parse({ filename: "archivo.exe", base64Data: "AAAA" })
    ).toThrow();
  });

  it("acepta una imagen jpg válida", () => {
    expect(() =>
      UploadImage.parse({ filename: "foto.jpg", base64Data: "AAAAAAAAAA" })
    ).not.toThrow();
  });
});
