"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import { NewsGrid } from "@/components/news/news-grid";
import { CATEGORIES, CATEGORY_INFO, type SearchResult } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SearchPageContent({
  initialQuery,
  initialTag,
  results,
}: {
  initialQuery: string;
  initialTag: string;
  results: SearchResult[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const activeCategory = searchParams.get("categoria") ?? "";

  const filtered = useMemo(() => {
    if (!activeCategory) return results;
    return results.filter((r) => r.article.category === activeCategory);
  }, [results, activeCategory]);

  function updateParams(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    router.push(`/buscar?${params.toString()}`);
  }

  return (
    <div className="container-editorial py-8">
      <header className="border-b border-border pb-5">
        <p className="kicker">Buscador</p>
        <h1 className="mt-1 font-heading text-3xl font-bold tracking-tight">
          Buscar noticias
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateParams({ q: query || null });
          }}
          className="mt-5 flex max-w-xl items-center gap-2 border border-border px-4 py-2.5"
        >
          <SearchIcon className="size-4 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Título, extracto, categoría o tag…"
            className="w-full bg-transparent text-sm outline-none"
          />
        </form>

        {initialTag && (
          <p className="mt-3 text-sm text-muted-foreground">
            Filtrando por tag:{" "}
            <span className="font-semibold text-brand-blue">#{initialTag}</span>
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => updateParams({ categoria: null })}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
              !activeCategory
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground/70 hover:bg-brand-blue-light"
            )}
          >
            Todas
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => updateParams({ categoria: c })}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
                activeCategory === c
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground/70 hover:bg-brand-blue-light"
              )}
            >
              {CATEGORY_INFO[c].name}
            </button>
          ))}
        </div>
      </header>

      <p className="py-5 text-sm text-muted-foreground">
        {filtered.length}{" "}
        {filtered.length === 1 ? "resultado encontrado" : "resultados encontrados"}
      </p>

      <NewsGrid articles={filtered.map((r) => r.article)} />
    </div>
  );
}
