import type { Metadata } from "next";
import { CategoryPageContent } from "@/components/category/category-page-content";
import { CATEGORY_INFO } from "@/lib/types";
import { SITE } from "@/lib/site";

const CATEGORY = "telecomunicaciones" as const;
const info = CATEGORY_INFO[CATEGORY];

export const metadata: Metadata = {
  title: info.name,
  description: `${info.description} Noticias y análisis en ${SITE.name}.`,
  alternates: { canonical: "/telecomunicaciones" },
};

export default async function TelecomunicacionesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? "1") || 1;
  return <CategoryPageContent category={CATEGORY} page={page} />;
}
