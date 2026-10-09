/**
 * Image Service
 * =============
 * Abstracción de almacenamiento de imágenes. Hoy usa /public/images
 * (almacenamiento local), pero expone la misma interfaz que tendría un
 * backend de Cloudinary o S3, para poder migrar sin tocar el resto de la
 * app ni el MCP.
 */
import fs from "node:fs";
import path from "node:path";

const IMAGES_DIR =
  process.env.PUBLIC_IMAGES_DIR ??
  path.join(process.cwd(), "public", "images");
const PUBLIC_PREFIX = "/images";

export type ImageProvider = "local" | "cloudinary" | "s3";

export interface UploadImageInput {
  /** Nombre de archivo deseado (sin ruta), p. ej. "5g-torre.jpg". */
  filename: string;
  /** Contenido en base64 (sin el prefijo data:...;base64,). */
  base64Data: string;
}

export interface UploadImageResult {
  url: string;
  provider: ImageProvider;
  filename: string;
}

function ensureDir() {
  if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

function sanitizeFilename(filename: string): string {
  const base = path.basename(filename).toLowerCase();
  return base.replace(/[^a-z0-9.\-_]/g, "-");
}

export const imageService = {
  provider: "local" as ImageProvider,

  /** Devuelve la URL pública para una imagen ya almacenada. */
  getUrl(filename: string): string {
    if (filename.startsWith("http") || filename.startsWith("/")) {
      return filename;
    }
    return `${PUBLIC_PREFIX}/${sanitizeFilename(filename)}`;
  },

  /** Sube (guarda) una imagen y devuelve su URL pública. */
  upload(input: UploadImageInput): UploadImageResult {
    return this.uploadBuffer(input.filename, Buffer.from(input.base64Data, "base64"));
  },

  /** Igual que upload(), pero recibe directamente los bytes (ej. tras descargar una URL). */
  uploadBuffer(filename: string, data: Buffer): UploadImageResult {
    ensureDir();
    const safeName = sanitizeFilename(filename);
    const filePath = path.join(IMAGES_DIR, safeName);
    fs.writeFileSync(filePath, data);
    return {
      url: this.getUrl(safeName),
      provider: this.provider,
      filename: safeName,
    };
  },

  /** Elimina una imagen almacenada localmente. */
  delete(filename: string): boolean {
    ensureDir();
    const filePath = path.join(IMAGES_DIR, sanitizeFilename(filename));
    if (!fs.existsSync(filePath)) return false;
    fs.unlinkSync(filePath);
    return true;
  },

  /** True si la referencia es una URL remota válida (http/https) o una ruta local existente. */
  isValidImageRef(ref: string): boolean {
    if (/^https?:\/\//.test(ref)) return true;
    if (ref.startsWith("/images/")) return true;
    return false;
  },
};
