import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

type RawSupabaseShoot = {
  name: string;
  slug: string;
  publication_date: string;
  description: string;
  stylist: { name: string; slug: string } | null;
  city: { name: string } | null;
  shoot_style_tags: { style_tags: { name: string; slug: string } }[];
  shoot_images: { image_url: string }[] | null;
};

export type TransformedShootType = {
  name: string;
  slug: string;
  publication_date: string;
  description: string;
  stylist: { name: string; slug: string } | null;
  city: { name: string | undefined };
  shoot_style_tags: { name: string; slug: string }[];
  shoot_images: { image_url: string }[] | null;
};

export async function GET() {
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
    .order("publication_date", { ascending: false })
    .limit(1)) as { data: RawSupabaseShoot[] | null };

  if (!latestShoot?.[0]) return NextResponse.json(null);

  const transformedShoot: TransformedShootType = {
    ...latestShoot[0],
    city: { name: latestShoot[0].city?.name },
    shoot_style_tags: latestShoot[0].shoot_style_tags?.map((tag) => ({
      name: tag.style_tags.name,
      slug: tag.style_tags.slug,
    })),
  };

  return NextResponse.json(transformedShoot);
}
