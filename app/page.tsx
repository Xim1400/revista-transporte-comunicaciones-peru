import type { Metadata } from "next";
import { articleService } from "@/lib/articles/articleService";
import { Carousel } from "@/components/home/carousel";
import { LatestNews } from "@/components/home/latest-news";
import { CategorySection } from "@/components/home/category-section";
import { NewsletterCta } from "@/components/home/newsletter-cta";
import { CATEGORIES } from "@/lib/types";
import { SITE } from "@/lib/site";

// Red de seguridad: el MCP invalida esta página al instante tras publicar
// (ver app/api/revalidate/route.ts). Si esa notificación falla o no está
// configurada, como mucho queda desactualizada 60s.
export const revalidate = 60;

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const latest = articleService.getLatestArticles(14);
  const featured = articleService.getFeaturedArticles(6);

  // El carrusel principal hace de hero y de destacadas a la vez. El resto
  // de "últimas noticias" excluye lo que ya se muestra en el carrusel para
  // no repetir la misma noticia dos veces en la portada.
  const carouselArticles = featured.length > 0 ? featured : latest.slice(0, 5);
  const carouselSlugs = new Set(carouselArticles.map((a) => a.slug));
  const rest = latest.filter((a) => !carouselSlugs.has(a.slug));

  return (
    <>
      <Carousel articles={carouselArticles} />

      <LatestNews main={rest.slice(0, 4)} sidebar={rest.slice(4, 9)} />

      <div className="border-t border-border">
        {CATEGORIES.map((category, i) => (
          <CategorySection
            key={category}
            category={category}
            tinted={i % 2 === 1}
            articles={articleService.getArticlesByCategory(category, 1, 3).items}
          />
        ))}
      </div>

      <NewsletterCta />
    </>
  );
}
