import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/types";
import { formatDateShort } from "@/lib/format";

/** Tarjeta compacta para listados densos (sidebar, "últimas noticias"). */
export function CompactNewsCard({
  article,
  showImage = true,
}: {
  article: Article;
  showImage?: boolean;
}) {
  return (
    <article className="group flex items-start gap-3 py-3">
      {showImage && (
        <Link
          href={`/noticias/${article.slug}`}
          className="relative size-16 shrink-0 overflow-hidden bg-muted"
        >
          <Image
            src={article.image}
            alt={article.imageAlt ?? article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="64px"
          />
        </Link>
      )}
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wider text-brand-blue">
          {article.category}
        </p>
        <h4 className="mt-1 font-heading text-sm font-semibold leading-snug">
          <Link
            href={`/noticias/${article.slug}`}
            className="line-clamp-2 transition-colors hover:text-brand-blue"
          >
            {article.title}
          </Link>
        </h4>
        <time dateTime={article.date} className="mt-1 block text-xs text-muted-foreground">
          {formatDateShort(article.date)}
        </time>
      </div>
    </article>
  );
}
