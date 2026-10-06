import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";

/**
 * Logotipo gráfico de la revista (public/brand/logo.jpg). Sustituye al
 * wordmark de texto en el navbar. El archivo ya trae fondo azul marino
 * propio, por lo que combina de forma continua con el navbar/menú móvil
 * sin recortes ni cajas visibles.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center", className)}
      aria-label={`${SITE.name} — Inicio`}
    >
      <Image
        src="/brand/logo.jpg"
        alt={`${SITE.name} — Revista Peruana de Transportes y Comunicaciones`}
        width={3114}
        height={1344}
        priority
        className="h-14 w-auto sm:h-16"
      />
    </Link>
  );
}
