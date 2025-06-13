import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { CardType } from "@/app/@ui";

export async function GET(req: NextRequest) {
  const subStyle = req.nextUrl.searchParams.get("subStyle");
  if (!subStyle) return NextResponse.json({ shoots: [] });

  const supabase = await createClient();

  const { data: tag } = await supabase
    .from("style_tags")
    .select("id")
    .eq("slug", subStyle)
    .single();

  if (!tag) return NextResponse.json({ shoots: [] });

  const { data: shootIdRows } = await supabase
    .from("shoot_style_tags")
    .select("shoot_id")
    .eq("style_tag_id", tag.id);

  if (!shootIdRows?.length) return NextResponse.json({ shoots: [] });

  const shootIds = shootIdRows.map((row: { shoot_id: number }) => row.shoot_id);

  const { data: shootsData } = await supabase
    .from("shoots")
    .select(
      `
        name, 
        slug, 
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

  const transformedShoots: CardType[] = (shootsData ?? []).map((shoot: any) => {
    const { shoot_images, stylist, city, ...shootWithoutImages } = shoot;
    return {
      ...shootWithoutImages,
      stylist: Array.isArray(stylist)
        ? (stylist[0] ?? null)
        : (stylist ?? null),
      city: Array.isArray(city) ? (city[0] ?? null) : (city ?? null),
      shoot_style_tags:
        shoot.shoot_style_tags?.map((tag: any) => ({
          name: tag.style_tags.name,
          slug: tag.style_tags.slug,
        })) ?? null,
      first_image: shoot_images?.[0]?.image_url || null,
    };
  });

  return NextResponse.json({ shoots: transformedShoots });
}
