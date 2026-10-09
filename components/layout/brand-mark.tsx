import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";

/**
 * Logotipo gráfico de la revista (public/brand/logo-navbar.jpg).
 * Recortado al contenido real (sin el aire sobrante del archivo
 * original, public/brand/logo-full.jpg) para que, al escalarlo por
 * altura, el texto se vea tan grande como sea posible. El fondo azul
 * marino del archivo combina sin recortes con el navbar/menú móvil.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center", className)}
      aria-label={`${SITE.name} — Inicio`}
    >
      <Image
        src="/brand/logo-navbar.jpg"
        alt={`${SITE.name} — Inicio`}
        width={2494}
        height={556}
        priority
        className="h-10 w-auto sm:h-11"
      />
    </Link>
  );
}
