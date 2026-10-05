import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { imageService } from "../../lib/images/imageService.js";
import { UploadImageSchema } from "../schemas/article.js";

const MAX_BASE64_LENGTH = 8_000_000; // ~6MB de imagen decodificada.

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
}
