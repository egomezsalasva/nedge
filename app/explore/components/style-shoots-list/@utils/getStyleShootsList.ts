import { CardType } from "@/app/ui";
import { createClient } from "@/utils/supabase/client";

export type StyleShootsResponse = {
  shoots: CardType[];
};

type ShootType = {
  name: string;
  slug: string;
  preview_slug: string | null;
  publication_date: string;
  description: string;
  stylist: { name: string; slug: string }[];
  city: { name: string }[];
  shoot_style_tags: { style_tags: { name: string; slug: string } }[];
  shoot_images: { image_url: string }[];
};

export const getStyleShootsList = async (
  subStyle: string,
): Promise<StyleShootsResponse> => {
  if (!subStyle) return { shoots: [] };

  const supabase = createClient();

  const { data: tag } = await supabase
    .from("style_tags")
    .select("id")
    .eq("slug", subStyle)
    .single();

  if (!tag) return { shoots: [] };

  const { data: shootIdRows } = await supabase
    .from("shoot_style_tags")
    .select("shoot_id")
    .eq("style_tag_id", tag.id);

  if (!shootIdRows?.length) return { shoots: [] };

  const shootIds = shootIdRows.map((row: { shoot_id: number }) => row.shoot_id);

  const { data: shootsData } = await supabase
    .from("shoots")
    .select<string, ShootType>(
      `
        name, 
        slug, 
        preview_slug,
        publication_date,
        description,
        stylist:stylists!stylist_id (name, slug),
        city:cities!city_id (name),
        shoot_style_tags (style_tags (name, slug)),
        shoot_images (image_url)
      `,
    )
    .in("id", shootIds)
    .order("publication_date", { ascending: false });

  const transformedShoots = (shootsData ?? [])
    .filter(
      (shoot: ShootType) =>
        !shoot.preview_slug ||
        (typeof shoot.preview_slug === "string" &&
          shoot.preview_slug.trim() === ""),
    )
    .map((shoot: ShootType) => {
      const { shoot_images, stylist, city, ...shootWithoutImages } = shoot;
      return {
        ...shootWithoutImages,
        stylist: Array.isArray(stylist)
          ? (stylist[0] ?? null)
          : (stylist ?? null),
        city: Array.isArray(city) ? (city[0] ?? null) : (city ?? null),
        shoot_style_tags:
          shoot.shoot_style_tags?.map((tag) => ({
            name: tag.style_tags.name,
            slug: tag.style_tags.slug,
          })) ?? null,
        first_image: shoot_images?.[0]?.image_url || "",
      };
    });

  return { shoots: transformedShoots as CardType[] };
};
