import { CATEGORIES, CATEGORY_INFO, type CategoryInfo, type CategorySlug } from "../types";

export const categoryService = {
  getCategories(): CategoryInfo[] {
    return CATEGORIES.map((slug) => CATEGORY_INFO[slug]);
  },
  getCategory(slug: string): CategoryInfo | null {
    if ((CATEGORIES as readonly string[]).includes(slug)) {
      return CATEGORY_INFO[slug as CategorySlug];
    }
    return null;
  },
  isValidCategory(slug: string): slug is CategorySlug {
    return (CATEGORIES as readonly string[]).includes(slug);
  },
};
