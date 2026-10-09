import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { imageService } from "../../lib/images/imageService.js";
import { UploadImageSchema, FetchImageFromUrlSchema } from "../schemas/article.js";

const MAX_BASE64_LENGTH = 8_000_000; // ~6MB de imagen decodificada.
const MAX_REMOTE_IMAGE_BYTES = 8_000_000; // ~8MB, mismo orden que el límite de base64.

const CONTENT_TYPE_TO_EXT: Record<string, string[]> = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
  "image/svg+xml": ["svg"],
};

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

export function registerImageTools(server: McpServer) {
  server.registerTool(
    "upload_image",
    {
      title: "Subir imagen",
      description:
        "Sube una imagen (JPEG/PNG/WebP/SVG, en base64) al almacenamiento de la revista y devuelve su URL pública, lista para usar como `image` en create_article/update_article.",
      inputSchema: UploadImageSchema,
    },
    async ({ filename, base64Data, altText }) => {
      if (base64Data.length > MAX_BASE64_LENGTH) {
        return errorResult("La imagen supera el tamaño máximo permitido (~6MB).");
      }
      try {
        const result = imageService.upload({ filename, base64Data });
        return text({
          message: "Imagen subida correctamente.",
          url: result.url,
          altText,
          provider: result.provider,
        });
      } catch (err) {
        return errorResult((err as Error).message);
      }
    }
  );

  server.registerTool(
    "fetch_image_from_url",
    {
      title: "Descargar imagen desde una URL",
      description:
        "Descarga una imagen desde una URL pública y la guarda en el almacenamiento de la revista, devolviendo su URL local (lista para usar en create_article/update_article). " +
        "Úsala SOLO con imágenes de licencia abierta o dominio público (Wikimedia Commons, Pexels, Unsplash, Pixabay, o prensa oficial del Estado peruano: MTC, ProInversión, APN, municipalidades, Presidencia). " +
        "Nunca descargues fotos de medios de noticias con copyright (diarios, agencias de prensa) sin verificar explícitamente que el usuario tiene licencia para usarlas. " +
        "Si la licencia de origen exige atribución (p. ej. CC BY o CC BY-SA), incluye el crédito en `attribution`.",
      inputSchema: FetchImageFromUrlSchema,
    },
    async ({ url, filename, altText, attribution }) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          return errorResult(`No se pudo descargar la imagen (HTTP ${response.status}).`);
        }

        const contentType = response.headers.get("content-type")?.split(";")[0]?.trim() ?? "";
        const allowedExts = CONTENT_TYPE_TO_EXT[contentType];
        if (!allowedExts) {
          return errorResult(
            `Tipo de contenido no soportado: "${contentType || "desconocido"}". Debe ser JPEG, PNG, WebP o SVG.`
          );
        }
        const requestedExt = filename.split(".").pop()!.toLowerCase();
        if (!allowedExts.includes(requestedExt)) {
          return errorResult(
            `La extensión de "${filename}" no coincide con el tipo real de la imagen (${contentType}).`
          );
        }

        const contentLength = Number(response.headers.get("content-length") ?? "0");
        if (contentLength > MAX_REMOTE_IMAGE_BYTES) {
          return errorResult("La imagen supera el tamaño máximo permitido (~8MB).");
        }

        const buffer = Buffer.from(await response.arrayBuffer());
        if (buffer.byteLength > MAX_REMOTE_IMAGE_BYTES) {
          return errorResult("La imagen supera el tamaño máximo permitido (~8MB).");
        }

        const result = imageService.uploadBuffer(filename, buffer);
        return text({
          message: "Imagen descargada y guardada correctamente.",
          url: result.url,
          altText,
          attribution,
          provider: result.provider,
          sourceUrl: url,
        });
      } catch (err) {
        return errorResult(`No se pudo descargar la imagen: ${(err as Error).message}`);
      }
    }
  );
}
