import type { Article } from "@/lib/types";
import { NewsCard } from "@/components/news/news-card";

export function RelatedArticles({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;
  return (
    <section className="border-t border-border pt-10">
      <h2 className="font-heading text-xl font-bold tracking-tight">
        Noticias relacionadas
      </h2>
      <div className="mt-6 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <NewsCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  );
}
