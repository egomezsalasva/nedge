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
  const { data: shoots, error: shootsError } = await supabase
    .from("shoots")
    .select("id, preview_slug");

  if (brandsError || garmentsError || shootGarmentsError || shootsError) {
    throw new Error(
      brandsError?.message ||
        garmentsError?.message ||
        shootGarmentsError?.message ||
        shootsError?.message ||
        "Unknown error",
    );
  }

  const validShootIds = new Set(
    (shoots ?? [])
      .filter((shoot) => !shoot.preview_slug)
      .map((shoot) => shoot.id),
  );

  return brands
    .map((brand) => {
      const brandGarments = garments.filter((g) => g.brand_id === brand.id);
      const itemCount = brandGarments.length;
      const garmentIds = brandGarments.map((g) => g.id);
      const shootIds = shootGarments
        .filter(
          (sg) =>
            garmentIds.includes(sg.garment_id) &&
            validShootIds.has(sg.shoot_id),
        )
        .map((sg) => sg.shoot_id);
      const shootCount = new Set(shootIds).size;

      return {
        ...brand,
        itemCount,
        shootCount,
      };
    })
    .filter((brand) => brand.shootCount > 0);
}
