import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { GarmsList, ShootDetails, SlideshowHero } from "./components";
import { ShootType } from "@/app/types";
import { PostgrestError } from "@supabase/supabase-js";
import styles from "./page.module.css";

type RawSupabaseShoot = {
  id: number;
  name: string;
  slug: string;
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

export default async function Shoot({
  params,
}: {
  params: Promise<{ stylists: string; shoot: string }>;
}) {
  const { stylists, shoot } = await params;

  const supabase = await createClient();

  const { data: shootData } = (await supabase
    .from("shoots")
    .select(
      `
        id,
        name, 
        slug, 
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

  if (!shootData) {
    notFound();
  }

  const transformedShoot: ShootType = {
    id: shootData.id,
    name: shootData.name,
    description: shootData.description,
    slug: shootData.slug,
    publication_date: shootData.publication_date,
    city: shootData.city,
    stylist: shootData.stylist,
    shoot_style_tags: shootData.shoot_style_tags.map(
      (tag: { style_tags: { name: string; slug: string } }) => tag.style_tags,
    ),
    shoot_images: shootData.shoot_images,
    shoot_garments: shootData.shoot_garments.map(
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

  return (
    <div>
      <main className={styles.main}>
        <SlideshowHero shootData={transformedShoot} />
        <div className={styles.infoContainer} id="info">
          <GarmsList garmsData={transformedShoot.shoot_garments || []} />
          <ShootDetails shootData={transformedShoot} />
        </div>
      </main>
    </div>
  );
}
