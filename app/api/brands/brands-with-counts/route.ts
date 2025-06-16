import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
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
    return NextResponse.json(
      {
        error:
          brandsError?.message ||
          garmentsError?.message ||
          shootGarmentsError?.message,
      },
      { status: 500 },
    );
  }

  const result = brands.map((brand) => {
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

  return NextResponse.json(result);
}
