import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/types";
import { CategoryBadge } from "@/components/news/category-badge";
import { formatDate } from "@/lib/format";

/** Tarjeta horizontal: imagen a un lado, texto al otro. Usada en grids de categoría. */
export function HorizontalNewsCard({ article }: { article: Article }) {
  return (
    <article className="group grid grid-cols-5 gap-4 border-b border-border py-5 sm:gap-6">
      <Link
        href={`/noticias/${article.slug}`}
        className="relative col-span-2 aspect-[4/3] overflow-hidden bg-muted sm:col-span-1"
      >
        <Image
          src={article.image}
          alt={article.imageAlt ?? article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(min-width: 640px) 20vw, 40vw"
        />
      </Link>
      <div className="col-span-3 flex flex-col sm:col-span-4">
        <div className="flex items-center gap-3">
          <CategoryBadge category={article.category} />
          <time dateTime={article.date} className="text-xs text-muted-foreground">
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
