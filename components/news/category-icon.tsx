import type { CategorySlug } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Mismo lenguaje de trazo que los placeholders de imagen
 * (scripts/generate-placeholders.mjs): un ícono de línea por categoría,
 * reutilizado aquí como parte del sistema de identidad — aparece junto
 * al nombre de la categoría en toda la interfaz (badges, navbar,
 * encabezados de sección), no solo en las imágenes.
 */
const PATHS: Record<CategorySlug, string> = {
  transporte:
    'M4 16h16M6 16v3M18 16v3M5 12l1.5-5A2 2 0 0 1 8.4 5.5h7.2A2 2 0 0 1 17.5 7L19 12v4H5v-4Z',
  aeropuertos: 'M2.5 16.5 21 11l.5 2-8 3.3.5 4.2-2.3 1-1.2-4.6-5 1.6-.6-1.6 3.7-2.6-5-1.8Z',
  puertos: 'M12 3v9M9 6h6M4 14l1.5 6h13L20 14M4 14h16M4 14l4-3M20 14l-4-3',
  telecomunicaciones: 'M12 3v6M12 9a4 4 0 0 1 4 4M12 9a4 4 0 0 0-4 4M12 9a7 7 0 0 1 7 7M12 9a7 7 0 0 0-7 7',
  infraestructura: 'M4 20 10 6l4 8 2-4 4 10H4ZM3 20h18',
};

export function CategoryIcon({
  category,
  className,
}: {
  category: CategorySlug;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-4", className)}
      aria-hidden
    >
      <path d={PATHS[category]} />
      {category === "transporte" && (
        <>
          <circle cx="8" cy="19" r="1" fill="currentColor" stroke="none" />
          <circle cx="16" cy="19" r="1" fill="currentColor" stroke="none" />
        </>
      )}
      {category === "telecomunicaciones" && (
        <circle cx="12" cy="3" r="1.2" fill="currentColor" stroke="none" />
      )}
    </svg>
  );
}
