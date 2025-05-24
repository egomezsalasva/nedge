import { brands } from "@/app/brands/@data";
import { getBrand } from "./";

export const findBrandKeyBySlug = (slug: string): string | undefined => {
  return Object.keys(brands).find((key) => getBrand(key).slug === slug);
};
