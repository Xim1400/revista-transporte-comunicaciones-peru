import type { Article } from "@/lib/types";
import { HorizontalNewsCard } from "@/components/news/horizontal-news-card";
import { CompactNewsCard } from "@/components/news/compact-news-card";

export function LatestNews({
  main,
  sidebar,
}: {
  main: Article[];
  sidebar: Article[];
}) {
  return (
    <section className="container-editorial py-12">
      <div className="mb-6 border-b border-border pb-4">
        <p className="kicker">Al minuto</p>
        <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight">
          Últimas noticias
        </h2>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {main.map((article) => (
            <HorizontalNewsCard key={article.slug} article={article} />
          ))}
        </div>

        <aside className="lg:col-span-1 lg:border-l lg:border-border lg:pl-8">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Más leídas
          </h3>
          <div className="divide-y divide-border">
            {sidebar.map((article) => (
              <CompactNewsCard key={article.slug} article={article} />
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
