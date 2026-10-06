/**
 * Revalidate Service
 * ==================
 * Tras crear/publicar/despublicar/actualizar/destacar/eliminar un
 * artículo, avisa al frontend para que invalide la caché de las páginas
 * afectadas (home, artículo, sitemap) — así el contenido aparece al
 * instante en la revista sin esperar al próximo `npm run build` ni a que
 * expire el respaldo por tiempo (ver app/api/revalidate/route.ts).
 *
 * Diseñado para fallar en silencio: si el frontend no está arrancado
 * (p. ej. probando el MCP suelto con el Inspector) o no está configurado
 * REVALIDATE_SECRET, la operación de contenido igual se completa — solo
 * se pierde la actualización instantánea, cubierta por el respaldo por
 * tiempo de cada página.
 */
import type { Article } from "../../lib/types.js";

// Dentro de docker-compose, el MCP debe llamar al servicio `web` por su
// nombre en la red interna (no por el puerto publicado en el host).
// Fuera de Docker (dev local, Inspector, test-client.mjs) el default
// apunta al `next dev`/`next start` típico en localhost.
const INTERNAL_WEB_URL =
  process.env.INTERNAL_WEB_URL ?? "http://localhost:3000";
const SECRET = process.env.REVALIDATE_SECRET;

export async function triggerRevalidate(paths: string[]): Promise<void> {
  if (!SECRET) return; // no configurado: se confía en el respaldo por tiempo.

  try {
    const res = await fetch(`${INTERNAL_WEB_URL}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-secret": SECRET,
      },
      body: JSON.stringify({ paths }),
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) {
      console.error(
        `[MCP] Revalidación rechazada (${res.status}): ${await res.text()}`
      );
    }
  } catch (err) {
    console.error(
      "[MCP] No se pudo avisar al sitio para revalidar (se usará el respaldo por tiempo):",
      (err as Error).message
    );
  }
}

/** Rutas que afecta un cambio de estado/contenido en un artículo. */
export function articlePaths(article: Pick<Article, "slug" | "category">): string[] {
  return ["/", `/${article.category}`, `/noticias/${article.slug}`, "/sitemap.xml"];
}
