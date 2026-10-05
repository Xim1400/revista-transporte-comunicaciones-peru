import Link from "next/link";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";

/**
 * Wordmark de la revista, construido íntegramente con tipografía + CSS.
 * No depende de ningún archivo de imagen externo, por lo que puede
 * modificarse cambiando únicamente `SITE.name` en `lib/site.ts`.
 */
export function Logo({
  className,
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const [first, ...rest] = SITE.name.split("&");
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center font-heading text-2xl font-bold tracking-tight",
        variant === "light" ? "text-white" : "text-primary",
        className
      )}
      aria-label={`${SITE.name} — Inicio`}
    >
      <span>{first}</span>
      <span className="text-brand-yellow">&amp;</span>
      <span>{rest.join("&")}</span>
      <span className="ml-1.5 hidden h-2 w-2 translate-y-[-10px] bg-brand-yellow transition-transform group-hover:translate-y-[-12px] sm:inline-block" />
    </Link>
  );
}
