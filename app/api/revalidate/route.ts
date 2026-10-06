import { timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Revalidación bajo demanda.
 *
 * El contenido vive en archivos (ver lib/content/repository.ts) y la UI
 * lee ese filesystem en páginas que Next.js cachea (home, artículo,
 * sitemap). Sin esto, una noticia creada/publicada vía MCP no aparecería
 * en la portada hasta el próximo `npm run build`.
 *
 * El MCP llama a este endpoint justo después de cada operación que
 * cambia contenido visible (publicar, despublicar, actualizar, destacar,
 * eliminar), indicando qué rutas invalidar. Protegido con un secreto
 * compartido — nunca expuesto al navegador ni al frontend público.
 */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function POST(request: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) {
    // Falla cerrado: sin secreto configurado, no se acepta ninguna
    // petición (igual que MCP_API_KEY en el servidor MCP).
    return NextResponse.json(
      { error: "REVALIDATE_SECRET no configurado en el servidor." },
      { status: 503 }
    );
  }

  const provided = request.headers.get("x-revalidate-secret") ?? "";
  if (!safeEqual(provided, expected)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const paths = Array.isArray(body?.paths)
    ? body.paths.filter((p: unknown): p is string => typeof p === "string")
    : [];

  if (paths.length === 0) {
    return NextResponse.json(
      { error: "Debes indicar `paths`: string[]." },
      { status: 400 }
    );
  }

  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({ revalidated: true, paths });
}
