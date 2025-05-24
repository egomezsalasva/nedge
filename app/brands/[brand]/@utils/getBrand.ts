import { brands, BrandType } from "@/app/brands/@data";

export const getBrand = (key: string): BrandType => {
  return brands[key as keyof typeof brands];
};
