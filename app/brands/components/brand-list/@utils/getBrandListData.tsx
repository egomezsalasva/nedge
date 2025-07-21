import { createClient } from "@/utils/supabase/server";

export type Brand = {
  id: number;
  name: string;
  slug: string;
  itemCount: number;
  shootCount: number;
};

export async function getBrandListData(): Promise<Brand[]> {
  const supabase = await createClient();

  const { data: brands, error: brandsError } = await supabase
    .from("brands")
    .select("id, name, slug");
  const { data: garments, error: garmentsError } = await supabase
    .from("garments")
    .select("id, brand_id");
  const { data: shootGarments, error: shootGarmentsError } = await supabase
    .from("shoot_garments")
    .select("id, garment_id, shoot_id");

  if (brandsError || garmentsError || shootGarmentsError) {
    throw new Error(
      brandsError?.message ||
        garmentsError?.message ||
        shootGarmentsError?.message ||
        "Unknown error",
    );
  }

  return brands.map((brand) => {
    const brandGarments = garments.filter((g) => g.brand_id === brand.id);
    const itemCount = brandGarments.length;
    const garmentIds = brandGarments.map((g) => g.id);
    const shootIds = shootGarments
      .filter((sg) => garmentIds.includes(sg.garment_id))
      .map((sg) => sg.shoot_id);
    const shootCount = new Set(shootIds).size;

    return {
      ...brand,
      itemCount,
      shootCount,
    };
  });
}
