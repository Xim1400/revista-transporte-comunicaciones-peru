"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";
import { SITE } from "@/lib/site";

export function ShareButtons({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const url = `${SITE.url}/noticias/${slug}`;

  const networks = [
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Compartir
      </span>
      {networks.map((n) => (
        <a
          key={n.label}
          href={n.href}
          target="_blank"
          rel="noreferrer noopener"
          className="border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-brand-blue hover:text-brand-blue"
        >
          {n.label}
        </a>
      ))}
      <button
        type="button"
        onClick={() => {
          navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          });
        }}
        className="flex items-center gap-1.5 border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-brand-blue hover:text-brand-blue"
      >
        {copied ? <Check className="size-3.5" /> : <Link2 className="size-3.5" />}
        {copied ? "Copiado" : "Copiar enlace"}
      </button>
    </div>
  );
}
