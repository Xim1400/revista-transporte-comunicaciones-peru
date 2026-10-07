import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/types";
import { CATEGORY_INFO } from "@/lib/types";
import { CategoryIcon } from "@/components/news/category-icon";
import { formatDate } from "@/lib/format";

/**
 * Noticia dentro de la línea de tiempo de "Últimas noticias" — el ícono de
 * la categoría va dentro del punto de la línea, como si fuera una ruta.
 */
export function TimelineNewsItem({ article }: { article: Article }) {
  const info = CATEGORY_INFO[article.category];
  return (
    <article className="group relative flex gap-4 pl-11 sm:gap-5">
      <span className="absolute left-0 top-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-brand-navy bg-background text-brand-navy transition-colors duration-300 group-hover:border-brand-yellow group-hover:bg-brand-navy group-hover:text-brand-yellow">
        <CategoryIcon category={article.category} className="size-4" />
      </span>

      <Link
        href={`/noticias/${article.slug}`}
        className="relative hidden aspect-[4/3] w-28 shrink-0 overflow-hidden bg-muted sm:block sm:w-36"
      >
        <Image
          src={article.image}
          alt={article.imageAlt ?? article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="144px"
        />
      </Link>

      <div className="min-w-0 flex-1 pb-8">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-brand-blue">
          <span>{info.name}</span>
          <span className="text-muted-foreground" aria-hidden>
            ·
          </span>
          <time dateTime={article.date} className="font-normal text-muted-foreground">
            {formatDate(article.date)}
          </time>
        </div>
        <h3 className="mt-1.5 font-heading text-base font-semibold leading-snug sm:text-lg">
          <Link href={`/noticias/${article.slug}`} className="transition-colors hover:text-brand-blue">
            {article.title}
          </Link>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
          {article.excerpt}
        </p>
      </div>
    </article>
  );
}
