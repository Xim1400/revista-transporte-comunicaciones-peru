import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Article, CategorySlug } from "@/lib/types";
import { CATEGORY_INFO } from "@/lib/types";
import { NewsCard } from "@/components/news/news-card";

export function CategorySection({
  category,
  articles,
}: {
  category: CategorySlug;
  articles: Article[];
}) {
  if (articles.length === 0) return null;
  const info = CATEGORY_INFO[category];

  return (
    <section className="container-editorial py-12">
      <div className="mb-6 flex items-end justify-between border-b border-border pb-4">
        <div>
          <p className="kicker">{info.name}</p>
          <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight">
            {info.name}
          </h2>
        </div>
        <Link
          href={`/${category}`}
          className="group flex items-center gap-1 text-sm font-semibold text-brand-blue"
        >
          Ver todas
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {articles.slice(0, 3).map((article) => (
          <NewsCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  );
}
