export const createItemsCounter = (brands: any, shoots: any) => {
  return (brandName: string): number => {
    if (!brands || Object.keys(brands).length === 0) {
      return 0;
    }
    const brand = brands[brandName as keyof typeof brands];
    if (!brand || !brand.name) {
      return 0;
    }
    if (!shoots || !Array.isArray(shoots)) {
      return 0;
    }
    return shoots.reduce((total: number, shoot: any) => {
      return (
        total +
        (shoot.items?.filter(
          (item: any) =>
            item.brand === brands[brandName as keyof typeof brands].name,
        ).length || 0)
      );
    }, 0);
  };
};
