import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { brand: string } },
) {
  const supabase = await createClient();
  const { brand: brandSlug } = params;

  const { data: brandData, error: brandError } = await supabase
    .from("brands")
    .select("id, name, instagram_url")
    .eq("slug", brandSlug)
    .single();

  if (brandError || !brandData) {
    return new Response(JSON.stringify({ error: "Brand not found" }), {
      status: 404,
    });
  }

  const brandId = brandData.id;

  const { data: garments, error: garmentsError } = await supabase
    .from("garments")
    .select("id")
    .eq("brand_id", brandId);

  if (garmentsError || !garments || garments.length === 0) {
    return new Response(JSON.stringify({ error: "No garments found" }), {
      status: 404,
    });
  }

  const garmentIds = garments.map((g) => g.id);

  const { data: shootGarments, error: shootGarmentsError } = await supabase
    .from("shoot_garments")
    .select("shoot_id")
    .in("garment_id", garmentIds);

  if (shootGarmentsError || !shootGarments || shootGarments.length === 0) {
    return new Response(JSON.stringify({ error: "No shoot garments found" }), {
      status: 404,
    });
  }

  const shootIds = shootGarments.map((sg) => sg.shoot_id);

  const { data: brandShoots, error: shootsError } = await supabase
    .from("shoots")
    .select(
      `
        id,
        name, 
        slug, 
        publication_date,
        stylist:stylists!stylist_id (
          name, 
          slug
        ),
        city:cities!city_id (
          name
        ),
        shoot_style_tags (
          style_tags (
            name, 
            slug
          )
        ),
        shoot_images (
          image_url
        ),
        shoot_garments (
          garment_id,
          garments (
            brand_id (slug),
            garment_types (
              name
            )
          )
        )
      `,
    )
    .in("id", shootIds);

  if (shootsError || !brandShoots) {
    return new Response(JSON.stringify({ error: "No shoots found" }), {
      status: 404,
    });
  }

  const transformedShoots = brandShoots.map((shoot) => {
    const { shoot_images, shoot_garments, ...shootWithoutImages } = shoot;

    const garmentTypes = (shoot_garments ?? [])
      .filter((sg) => sg.garments?.brand_id?.slug === brandSlug)
      .map((sg) => sg.garments?.garment_types?.name)
      .filter(Boolean);

    const uniqueGarmentTypes = [...new Set(garmentTypes)];

    return {
      ...shootWithoutImages,
      city: { name: shoot.city?.name },
      shoot_style_tags: shoot.shoot_style_tags?.map((tag) => ({
        name: tag.style_tags.name,
        slug: tag.style_tags.slug,
      })),
      first_image: shoot_images?.[0]?.image_url || "",
      brandItemTypes: uniqueGarmentTypes,
    };
  });

  return new Response(
    JSON.stringify({
      brand: brandData,
      garments,
      shoots: transformedShoots,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}
