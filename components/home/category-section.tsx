import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Article, CategorySlug } from "@/lib/types";
import { CATEGORY_INFO } from "@/lib/types";
import { NewsCard } from "@/components/news/news-card";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

export function CategorySection({
  category,
  articles,
  tinted = false,
}: {
  category: CategorySlug;
  articles: Article[];
  /** Fondo alterno sutil, para romper el ritmo visual entre secciones. */
  tinted?: boolean;
}) {
  if (articles.length === 0) return null;
  const info = CATEGORY_INFO[category];

  return (
    <section className={cn("py-10", tinted && "bg-brand-gray-50")}>
      <div className="container-editorial">
        <Reveal>
          <div className="mb-6 flex items-end justify-between border-b border-border pb-3">
            <div>
              <p className="kicker">{info.name}</p>
              <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight">
                {info.name}
              </h2>
            </div>
            <Link
              href={`/${category}`}
              className="group flex items-center gap-1 text-sm font-semibold text-brand-blue transition-colors hover:text-brand-navy"
            >
              Ver todas
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
        <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 3).map((article, i) => (
            <Reveal key={article.slug} delay={i * 0.08}>
              <NewsCard article={article} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
