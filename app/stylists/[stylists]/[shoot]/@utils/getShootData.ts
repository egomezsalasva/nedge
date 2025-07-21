import { createClient } from "@/utils/supabase/server";
import { ShootType } from "@/app/types";
import { PostgrestError } from "@supabase/supabase-js";

type RawSupabaseShoot = {
  id: number;
  name: string;
  slug: string;
  preview_slug: string;
  publication_date: string;
  description: string;
  city: { name: string; country: string };
  stylist: {
    name: string;
    slug: string;
    description: string;
    instagram_url: string;
  };
  shoot_style_tags: { style_tags: { name: string; slug: string } }[];
  shoot_images: { image_url: string }[];
  shoot_garments: {
    garment_id: number;
    garments: {
      id: number;
      name: string;
      garment_type: { name: string };
      brand: { name: string; instagram_url: string };
      affiliate_link: string;
    };
  }[];
};

const transformShootData = (rawShootData: RawSupabaseShoot): ShootType => {
  return {
    id: rawShootData.id,
    name: rawShootData.name,
    description: rawShootData.description,
    slug: rawShootData.slug,
    preview_slug: rawShootData.preview_slug,
    publication_date: rawShootData.publication_date,
    city: rawShootData.city,
    stylist: rawShootData.stylist,
    shoot_style_tags: rawShootData.shoot_style_tags.map(
      (tag: { style_tags: { name: string; slug: string } }) => tag.style_tags,
    ),
    shoot_images: rawShootData.shoot_images,
    shoot_garments: rawShootData.shoot_garments.map(
      (garment: {
        garments: {
          id: number;
          name: string;
          garment_type: { name: string };
          brand: { name: string; instagram_url: string };
          affiliate_link: string;
        };
      }) => {
        return {
          id: garment.garments.id,
          name: garment.garments.name,
          type: garment.garments.garment_type.name,
          brand: garment.garments.brand,
          affiliate_link: garment.garments.affiliate_link,
        };
      },
    ),
  };
};

export async function getShootData(
  stylists: string,
  shoot: string,
): Promise<ShootType | null> {
  const supabase = await createClient();

  const { data: rawShootData } = (await supabase
    .from("shoots")
    .select(
      `
        id,
        name, 
        slug, 
        preview_slug,
        publication_date, 
        description,
        stylist:stylists!stylist_id (name, slug, description, instagram_url),
        city:cities!city_id (name),
        shoot_style_tags (style_tags (name, slug)),
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
    .eq("slug", shoot)
    .eq("stylists.slug", stylists)
    .single()) as { data: RawSupabaseShoot | null; error: PostgrestError };

  if (!rawShootData) {
    return null;
  }

  return transformShootData(rawShootData);
}
