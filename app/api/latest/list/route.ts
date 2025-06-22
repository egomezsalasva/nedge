import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { CardType } from "@/app/ui";

type RawSupabaseShoot = {
  name: string;
  slug: string;
  publication_date: string;
  description: string;
  stylist: { name: string; slug: string };
  city: { name: string };
  shoot_style_tags: { style_tags: { name: string; slug: string } }[];
  shoot_images: { image_url: string }[];
};

export async function GET() {
  const supabase = await createClient();

  const { data: shootsList } = (await supabase
    .from("shoots")
    .select(
      `
        name, 
        slug, 
        publication_date,
        stylist:stylists!stylist_id (name, slug),
        city:cities!city_id (name),
        shoot_style_tags (style_tags (name, slug)),
        shoot_images (image_url)
      `,
    )
    .order("publication_date", { ascending: false })) as {
    data: RawSupabaseShoot[] | null;
  };

  if (!shootsList) return NextResponse.json(null);

  const transformedShoots: CardType[] = shootsList.map((shoot) => {
    const { shoot_images, ...shootWithoutImages } = shoot;
    return {
      ...shootWithoutImages,
      city: { name: shoot.city?.name },
      shoot_style_tags: shoot.shoot_style_tags?.map((tag) => ({
        name: tag.style_tags.name,
        slug: tag.style_tags.slug,
      })),
      first_image: shoot_images?.[0]?.image_url || "",
    };
  });

  return NextResponse.json(transformedShoots);
}
