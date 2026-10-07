import type { Article } from "@/lib/types";
import { NewsCard } from "@/components/news/news-card";

export function NewsGrid({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        No hay noticias disponibles en este momento.
      </p>
    );
  }

  return (
    <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <NewsCard key={article.slug} article={article} />
      ))}
    </div>
  );
}
