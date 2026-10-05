"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Article } from "@/lib/types";
import { FeaturedNewsCard } from "@/components/news/featured-news-card";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 6000;

/** Carrusel principal de la homepage: hace de hero y de destacadas a la vez. */
export function Carousel({ articles }: { articles: Article[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const next = useCallback(
    () => setIndex((i) => (i + 1) % articles.length),
    [articles.length]
  );
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + articles.length) % articles.length),
    [articles.length]
  );

  useEffect(() => {
    if (paused || articles.length <= 1) return;
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, next, articles.length]);

  if (articles.length === 0) return null;

  return (
    <div
      className="relative bg-brand-navy"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        setPaused(true);
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        const start = touchStartX.current;
        if (start !== null) {
          const delta = e.changedTouches[0].clientX - start;
          if (delta > 40) prev();
          if (delta < -40) next();
        }
        touchStartX.current = null;
        setPaused(false);
      }}
      role="region"
      aria-roledescription="carrusel"
      aria-label="Noticia principal y destacadas"
    >
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={articles[index].slug}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <FeaturedNewsCard article={articles[index]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {articles.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Noticia anterior"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-primary shadow-sm transition-transform hover:scale-105"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Siguiente noticia"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-primary shadow-sm transition-transform hover:scale-105"
          >
            <ChevronRight className="size-5" />
          </button>

          <div className="absolute bottom-6 right-4 flex gap-2 sm:right-6">
            {articles.map((a, i) => (
              <button
                key={a.slug}
                type="button"
                aria-label={`Ir a la noticia ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index ? "w-6 bg-brand-yellow" : "w-2.5 bg-white/60"
                )}
              />
            ))}
          </div>
        </>
      )}

      <span className="absolute bottom-0 left-0 h-1.5 w-full bg-brand-yellow" />
    </div>
  );
}
