import { createClient } from "@/utils/supabase/server";

export async function getShootsFromBrandData(brandParam: string) {
  const supabase = await createClient();

  const { data: brandData } = await supabase
    .from("brands")
    .select("id, name, instagram_url")
    .eq("slug", brandParam)
    .single();
  const brandId = brandData?.id;

  const { data: garmentsData } = await supabase
    .from("garments")
    .select("id")
    .eq("brand_id", brandId);
  const garmentIds = garmentsData?.map((g) => g.id);

  const { data: shootGarmentsData } = await supabase
    .from("shoot_garments")
    .select("shoot_id")
    .in("garment_id", garmentIds || []);
  const shootIds = shootGarmentsData?.map((sg) => sg.shoot_id);

  const { data: brandShootsData } = await supabase
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
    .in("id", shootIds || []);

  const transformedShoots = (brandShootsData ?? []).map((shoot: any) => {
    const { shoot_images, shoot_garments, ...shootWithoutImages } = shoot;

    const garmentTypes = (shoot_garments ?? [])
      .filter((sg: any) => sg.garments?.brand_id?.slug === brandParam)
      .map((sg: any) => sg.garments?.garment_types?.name)
      .filter(Boolean);

    const uniqueGarmentTypes = [...new Set(garmentTypes)];

    return {
      ...shootWithoutImages,
      city: { name: shoot.city?.name },
      shoot_style_tags: shoot.shoot_style_tags?.map((tag: any) => ({
        name: tag.style_tags.name,
        slug: tag.style_tags.slug,
      })),
      first_image: shoot_images?.[0]?.image_url || "",
      brandItemTypes: uniqueGarmentTypes,
    };
  });

  return {
    brandData,
    garmentsData,
    transformedShoots,
  };
}
