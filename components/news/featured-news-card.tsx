import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Article } from "@/lib/types";
import { CategoryBadge } from "@/components/news/category-badge";
import { formatDate } from "@/lib/format";

/**
 * Slide del carrusel principal: banner a todo el ancho con imagen de fondo
 * y texto superpuesto. Es el mismo tratamiento visual que antes tenía el
 * hero estático, ahora reutilizado para cada noticia del carrusel.
 */
export function FeaturedNewsCard({ article }: { article: Article }) {
  return (
    <article className="relative w-full overflow-hidden bg-brand-navy">
      <div className="relative aspect-[4/5] w-full sm:aspect-[16/9] lg:aspect-[21/9]">
        <Image
          src={article.image}
          alt={article.imageAlt ?? article.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/80 sm:via-brand-navy/55 to-brand-navy/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/90 via-brand-navy/20 to-transparent" />
      </div>

      <div className="container-editorial absolute inset-x-0 bottom-0 pb-10 sm:pb-14 lg:pb-16">
        <div className="max-w-2xl">
          <CategoryBadge category={article.category} variant="light" />
          <h1 className="mt-3 font-heading text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
            <Link href={`/noticias/${article.slug}`} className="hover:underline">
              {article.title}
            </Link>
          </h1>
          {article.subtitle && (
            <p className="mt-3 text-lg text-white/80">{article.subtitle}</p>
          )}
          <p className="mt-3 max-w-xl text-base leading-relaxed text-white/70">
            {article.excerpt}
          </p>
          <div className="mt-5 flex items-center gap-4 text-sm text-white/60">
            <span className="font-medium text-white/80">{article.author}</span>
            <span aria-hidden>·</span>
            <time dateTime={article.date}>{formatDate(article.date)}</time>
          </div>
          <Link
            href={`/noticias/${article.slug}`}
            className="group mt-6 inline-flex w-fit items-center gap-2 bg-brand-yellow px-5 py-3 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-yellow-dark"
          >
            Leer noticia
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
