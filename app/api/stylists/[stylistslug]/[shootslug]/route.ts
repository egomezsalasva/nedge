import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

type RawSupabaseShoot = {
  name: string;
  slug: string;
  publication_date: string;
  description: string;
  stylist: {
    name: string;
    slug: string;
    description: string;
    instagram_url: string;
  } | null;
  city: { name: string } | null;
  shoot_style_tags: { style_tags: { name: string } }[] | null;
  shoot_images: { image_url: string }[] | null;
  shoot_garments:
    | {
        garments: {
          id: number;
          name: string;
          garment_type: { name: string };
          brand: { name: string; instagram_url: string };
          affiliate_link: string;
        };
      }[]
    | null;
};

type TransformedShootType = {
  name: string;
  slug: string;
  publication_date: string;
  description: string;
  stylist: {
    name: string;
    slug: string;
    description: string;
    instagram_url: string;
  };
  city: { name: string };
  shoot_style_tags: string[];
  shoot_images: { image_url: string }[];
  shoot_garments: {
    id: number;
    name: string;
    type: string;
    brand: { name: string; instagram_url: string };
    affiliate_link: string;
  }[];
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ stylistslug: string; shootslug: string }> },
) {
  const { stylistslug, shootslug } = await params;

  const supabase = await createClient();

  const { data: shoot, error } = (await supabase
    .from("shoots")
    .select(
      `
        name, 
        slug, 
        publication_date, 
        description,
        stylist:stylists!stylist_id (name, slug, description, instagram_url),
        city:cities!city_id (name),
        shoot_style_tags (style_tags (name)),
        shoot_images (image_url),
        shoot_garments (
          garments!garment_id (
            id,
            name,
            garment_type:garment_types!garment_type_id (
              name
            ),
            brand:brands!brand_id (
              name,
              instagram_url
            ),
            affiliate_link
          )
        )
      `,
    )
    .eq("slug", shootslug)
    .eq("stylists.slug", stylistslug)
    .single()) as { data: RawSupabaseShoot | null; error: any };

  if (error) {
    console.error("Error fetching shoot:", error);
    return NextResponse.json(
      { error: "Failed to fetch shoot" },
      { status: 500 },
    );
  }

  if (!shoot) {
    return NextResponse.json({ error: "Shoot not found" }, { status: 404 });
  }

  const transformedShoot: TransformedShootType = {
    name: shoot.name,
    slug: shoot.slug,
    publication_date: shoot.publication_date,
    description: shoot.description,
    stylist: {
      name: shoot.stylist?.name || "",
      slug: shoot.stylist?.slug || "",
      description: shoot.stylist?.description || "",
      instagram_url: shoot.stylist?.instagram_url || "",
    },
    city: { name: shoot.city?.name || "" },
    shoot_images:
      shoot.shoot_images?.map((img) => ({
        image_url: img.image_url,
      })) || [],
    shoot_style_tags:
      shoot.shoot_style_tags?.map((tag) => tag.style_tags.name) || [],
    shoot_garments:
      shoot.shoot_garments?.map((garment) => ({
        id: garment.garments.id,
        name: garment.garments.name,
        type: garment.garments.garment_type.name,
        brand: {
          name: garment.garments.brand.name,
          instagram_url: garment.garments.brand.instagram_url,
        },
        affiliate_link: garment.garments.affiliate_link,
      })) || [],
  };

  return NextResponse.json(transformedShoot);
}
