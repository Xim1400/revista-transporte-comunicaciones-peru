import Link from "next/link";
import { CATEGORY_INFO, type CategorySlug } from "@/lib/types";
import { CategoryIcon } from "@/components/news/category-icon";
import { cn } from "@/lib/utils";

export function CategoryBadge({
  category,
  className,
  variant = "default",
}: {
  category: CategorySlug;
  className?: string;
  variant?: "default" | "light";
}) {
  const info = CATEGORY_INFO[category];
  return (
    <Link
      href={`/${category}`}
      className={cn(
        "inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider transition-opacity hover:opacity-80",
        variant === "default" ? "text-brand-blue" : "text-white",
        className
      )}
    >
      <CategoryIcon category={category} className="size-3.5 text-brand-yellow" />
      {info.name}
    </Link>
  );
}
