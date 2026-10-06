import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { articleService } from "@/lib/articles/articleService";
import { contentRepository } from "@/lib/content/repository";
import { CATEGORY_INFO } from "@/lib/types";
import { Breadcrumb } from "@/components/article/breadcrumb";
import { ShareButtons } from "@/components/article/share-buttons";
import { RelatedArticles } from "@/components/article/related-articles";
import { formatDate } from "@/lib/format";
import { SITE } from "@/lib/site";

// Red de seguridad: el MCP invalida la página de un artículo al instante
// tras publicar/actualizar/despublicar (ver app/api/revalidate/route.ts).
// Un slug nuevo que aún no exista como página estática se renderiza al
// vuelo en la primera visita (dynamicParams, por defecto true).
export const revalidate = 60;

export function generateStaticParams() {
  return contentRepository
    .findAll({ status: "published" })
    .map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articleService.getArticleBySlug(slug);
  if (!article) return {};

  const url = `${SITE.url}/noticias/${article.slug}`;
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/noticias/${article.slug}` },
    authors: [{ name: article.author }],
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url,
      images: [{ url: article.image }],
      publishedTime: article.date,
      modifiedTime: article.updatedAt ?? article.date,
      authors: [article.author],
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articleService.getArticleBySlug(slug);
  if (!article) notFound();

  const related = articleService.getRelatedArticles(article, 3);
  const info = CATEGORY_INFO[article.category];
  const paragraphs = article.content.split("\n\n");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: [`${SITE.url}${article.image}`],
    datePublished: article.date,
    dateModified: article.updatedAt ?? article.date,
    author: [{ "@type": "Person", name: article.author }],
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    articleSection: info.name,
    keywords: article.tags.join(", "),
    mainEntityOfPage: `${SITE.url}/noticias/${article.slug}`,
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="container-editorial max-w-3xl py-8">
        <Breadcrumb category={article.category} title={article.title} />
        <p className="kicker mt-4">{info.name}</p>
        <h1 className="mt-2 font-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {article.title}
        </h1>
        {article.subtitle && (
          <p className="mt-3 text-lg text-muted-foreground">{article.subtitle}</p>
        )}
        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground/80">{article.author}</span>
          <span aria-hidden>·</span>
          <time dateTime={article.date}>{formatDate(article.date)}</time>
          {article.demo && (
            <span className="ml-auto bg-brand-yellow/20 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand-yellow-dark">
              Contenido de demostración
            </span>
          )}
        </div>
      </header>

      <div className="container-editorial max-w-4xl">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
          <Image
            src={article.image}
            alt={article.imageAlt ?? article.title}
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 896px, 100vw"
          />
        </div>
      </div>

      <div className="container-editorial max-w-3xl py-10">
        <div className="prose-editorial space-y-5 text-[17px] leading-relaxed text-foreground/90">
          {paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {article.gallery && article.gallery.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {article.gallery.map((src, i) => (
              <div key={src + i} className="relative aspect-[4/3] overflow-hidden bg-muted">
                <Image
                  src={src}
                  alt={`${article.title} — imagen adicional ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 640px) 33vw, 50vw"
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <Link
              key={tag}
              href={`/buscar?tag=${encodeURIComponent(tag)}`}
              className="bg-muted px-3 py-1 text-xs font-medium text-foreground/70 transition-colors hover:bg-brand-blue-light hover:text-brand-blue"
            >
              #{tag}
            </Link>
          ))}
        </div>

        <div className="mt-8 border-y border-border py-4">
          <ShareButtons slug={article.slug} title={article.title} />
        </div>
      </div>

      <div className="container-editorial max-w-5xl py-6 pb-16">
        <RelatedArticles articles={related} />
      </div>
    </article>
  );
}
