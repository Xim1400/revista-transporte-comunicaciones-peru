import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/types";
import { CategoryBadge } from "@/components/news/category-badge";
import { formatDate } from "@/lib/format";

/** Tarjeta estándar de noticia: imagen + categoría + título + extracto. */
export function NewsCard({ article }: { article: Article }) {
  return (
    <article className="group flex flex-col">
      <Link
        href={`/noticias/${article.slug}`}
        className="relative mb-4 block aspect-[16/10] overflow-hidden bg-muted"
      >
        <Image
          src={article.image}
          alt={article.imageAlt ?? article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      </Link>
      <div className="flex items-center justify-between">
        <CategoryBadge category={article.category} />
        <time dateTime={article.date} className="text-xs text-muted-foreground">
          {formatDate(article.date)}
        </time>
      </div>
      <h3 className="mt-2 font-heading text-lg font-semibold leading-snug">
        <Link
          href={`/noticias/${article.slug}`}
          className="transition-colors hover:text-brand-blue"
        >
          {article.title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
        {article.excerpt}
      </p>
      <p className="mt-3 text-xs font-medium text-foreground/60">
        {article.author}
      </p>
    </article>
  );
}
