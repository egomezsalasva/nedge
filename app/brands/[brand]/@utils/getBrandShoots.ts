import { shoots, ShootType } from "@/app/@data";

export const getBrandShoots = (brandName: string): ShootType[] => {
  return shoots.filter((shoot) =>
    shoot.items?.some((item) => item.brand === brandName),
  );
};
