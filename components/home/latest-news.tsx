import type { Article } from "@/lib/types";
import { TimelineNewsItem } from "@/components/home/timeline-news-item";
import { CompactNewsCard } from "@/components/news/compact-news-card";
import { Reveal } from "@/components/ui/reveal";

export function LatestNews({
  main,
  sidebar,
}: {
  main: Article[];
  sidebar: Article[];
}) {
  return (
    <section className="container-editorial py-10">
      <div className="mb-8 border-b border-border pb-3">
        <p className="kicker">Al minuto</p>
        <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight">
          Últimas noticias
        </h2>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="relative lg:col-span-2">
          {/* La "ruta" que conecta cada noticia, eco del ícono de la marca. */}
          <div
            className="absolute left-4 top-1 bottom-8 w-px bg-border"
            aria-hidden
          />
          {main.map((article, i) => (
            <Reveal key={article.slug} delay={i * 0.06}>
              <TimelineNewsItem article={article} />
            </Reveal>
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
