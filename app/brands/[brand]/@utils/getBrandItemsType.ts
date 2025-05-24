import { ShootType } from "@/app/@data";

export const getBrandItemsType = (
  shoot: ShootType,
  brand: string,
): string[] => {
  if (!shoot || !brand) {
    return [];
  }
  const brandItemTypes =
    shoot.items
      ?.filter((item) => item.brand === brand)
      .map((item) => item.type) || [];

  return [...new Set(brandItemTypes)];
};
