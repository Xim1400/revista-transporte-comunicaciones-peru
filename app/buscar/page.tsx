import type { Metadata } from "next";
import { Suspense } from "react";
import { searchService } from "@/lib/search/searchService";
import { SearchPageContent } from "@/components/search/search-page-content";

export const metadata: Metadata = {
  title: "Buscar",
  description: "Busca noticias por título, extracto, categoría o tags.",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string }>;
}) {
  const params = await searchParams;
  const query = params.q ?? "";
  const tag = params.tag ?? "";

  const results = searchService.search(query, {
    tag: tag || undefined,
  });

  return (
    <Suspense>
      <SearchPageContent
        initialQuery={query}
        initialTag={tag}
        results={results}
      />
    </Suspense>
  );
}

