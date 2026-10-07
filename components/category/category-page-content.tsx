import Link from "next/link";
import { articleService } from "@/lib/articles/articleService";
import { CATEGORY_INFO, type CategorySlug } from "@/lib/types";
import { NewsGrid } from "@/components/news/news-grid";
import { CategoryBadge } from "@/components/news/category-badge";
import { Reveal } from "@/components/ui/reveal";
import { formatDate } from "@/lib/format";

export function CategoryPageContent({
  category,
  page,
}: {
  category: CategorySlug;
  page: number;
}) {
  const info = CATEGORY_INFO[category];
  const result = articleService.getArticlesByCategory(category, page, 9);
  const [headline, ...others] = result.items;

  return (
    <>
      <header className="relative overflow-hidden border-b border-border bg-brand-gray-50">
        <span className="absolute inset-y-0 left-0 w-1.5 bg-brand-yellow" aria-hidden />
        <div className="container-editorial py-8">
          <p className="kicker">Sección</p>
          <h1 className="mt-1 font-heading text-4xl font-bold tracking-tight">
            {info.name}
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {info.description}
          </p>
        </div>
      </header>

      <div className="container-editorial py-8">
        {headline && (
          <Reveal>
            <article className="group mb-10 grid gap-6 border-b border-border pb-8 lg:grid-cols-2">
              <div className="order-2 flex flex-col justify-center lg:order-1">
                <CategoryBadge category={headline.category} />
                <h2 className="mt-2 font-heading text-2xl font-bold leading-tight sm:text-3xl">
                  <Link
                    href={`/noticias/${headline.slug}`}
                    className="transition-colors hover:text-brand-blue"
                  >
                    {headline.title}
                  </Link>
                </h2>
                <p className="mt-3 text-muted-foreground">{headline.excerpt}</p>
                <time dateTime={headline.date} className="mt-3 text-xs text-muted-foreground">
                  {formatDate(headline.date)} · {headline.author}
                </time>
              </div>
              <Link
                href={`/noticias/${headline.slug}`}
                className="relative order-1 aspect-[16/10] overflow-hidden bg-muted lg:order-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={headline.image}
                  alt={headline.imageAlt ?? headline.title}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
            </article>
          </Reveal>
        )}

        <Reveal delay={0.05}>
          <NewsGrid articles={others} />
        </Reveal>

        {result.totalPages > 1 && (
          <nav
            aria-label="Paginación"
            className="mt-12 flex items-center justify-center gap-2"
          >
            {Array.from({ length: result.totalPages }, (_, i) => i + 1).map(
              (p) => (
                <Link
                  key={p}
                  href={p === 1 ? `/${category}` : `/${category}?page=${p}`}
                  aria-current={p === page}
                  className={`flex size-9 items-center justify-center text-sm font-medium transition-colors ${
                    p === page
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/70 hover:bg-muted"
                  }`}
                >
                  {p}
                </Link>
              )
            )}
          </nav>
        )}
      </div>
    </>
  );
}
