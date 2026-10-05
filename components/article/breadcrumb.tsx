import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CATEGORY_INFO, type CategorySlug } from "@/lib/types";

export function Breadcrumb({
  category,
  title,
}: {
  category: CategorySlug;
  title: string;
}) {
  const info = CATEGORY_INFO[category];
  return (
    <nav aria-label="Ruta de navegación" className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Link href="/" className="hover:text-brand-blue">
        Inicio
      </Link>
      <ChevronRight className="size-3" />
      <Link href={`/${category}`} className="hover:text-brand-blue">
        {info.name}
      </Link>
      <ChevronRight className="size-3" />
      <span className="truncate text-foreground/70">{title}</span>
    </nav>
  );
}
