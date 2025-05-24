export const createShootsCounter = (brands: any, shoots: any) => {
  return (brandName: string): number => {
    return shoots.filter((shoot: any) =>
      shoot.items?.some(
        (item: any) =>
          item.brand === brands[brandName as keyof typeof brands].name,
      ),
    ).length;
  };
};
