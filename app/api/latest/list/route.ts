import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

type RawSupabaseShoot = {
  name: string;
  slug: string;
  publication_date: string;
  description: string;
  stylist: { name: string; slug: string } | null;
  city: { name: string } | null;
  shoot_style_tags: { style_tags: { name: string } }[] | null;
  shoot_images: { image_url: string }[] | null;
};

type TransformedShootType = {
  name: string;
  slug: string;
  publication_date: string;
  description: string;
  stylist: { name: string; slug: string } | null;
  city: { name: string | undefined };
  shoot_style_tags: string[] | undefined;
  first_image: string | null;
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
        shoot_style_tags (style_tags (name)),
        shoot_images (image_url)
      `,
    )
    .order("publication_date", { ascending: false })) as {
    data: RawSupabaseShoot[] | null;
  };

  if (!shootsList) return NextResponse.json(null);

  const transformedShoots: TransformedShootType[] = shootsList.map((shoot) => {
    const { shoot_images, ...shootWithoutImages } = shoot;
    return {
      ...shootWithoutImages,
      city: { name: shoot.city?.name },
      shoot_style_tags: shoot.shoot_style_tags?.map(
        (tag) => tag.style_tags.name,
      ),
      first_image: shoot_images?.[0]?.image_url || null,
    };
  });

  return NextResponse.json(transformedShoots);
}
