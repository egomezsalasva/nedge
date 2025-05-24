import { findBrandKeyBySlug } from "./findBrandKeyBySlug";
import { getBrand } from "./";

export const getBrandBySlug = (slug: string) => {
  const brandKey = findBrandKeyBySlug(slug);
  if (!brandKey) {
    throw new Error(`Brand with slug "${slug}" not found`);
  }
  return {
    key: brandKey,
    data: getBrand(brandKey),
  };
};
