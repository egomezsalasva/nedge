import { createClient } from "@/utils/supabase/client";

type RawShoot = {
  name: string;
  slug: string;
  publication_date: string;
  description: string;
  stylist: { name: string; slug: string };
  city: { name: string };
  shoot_style_tags: { style_tags: { name: string; slug: string } }[];
  shoot_images: { image_url: string }[];
};

export async function getLatestShootData() {
  const supabase = await createClient();

  const { data: latestShoot } = (await supabase
    .from("shoots")
    .select(
      `
      name, slug, publication_date, description,
      stylist:stylists!stylist_id (name, slug),
      city:cities!city_id (name),
      shoot_style_tags (style_tags (name, slug)),
      shoot_images (image_url)
    `,
    )
    .is("preview_slug", null)
    .order("publication_date", { ascending: false })
    .limit(1)
    .single()) as { data: RawShoot | null };

  if (!latestShoot) return null;

  return {
    ...latestShoot,
    city: { name: latestShoot.city?.name },
    stylist: latestShoot.stylist,
    shoot_style_tags: latestShoot.shoot_style_tags?.map((tag) => ({
      name: tag.style_tags.name,
      slug: tag.style_tags.slug,
    })),
  };
}
