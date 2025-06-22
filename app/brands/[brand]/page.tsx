import CardWithItems, {
  CardWithItemsType,
} from "@/app/ui/card-with-items/CardWithItems";
import Link from "next/link";
import { Insta } from "@/app/svgs";
import styles from "./page.module.css";
import { createClient } from "@/utils/supabase/server";

type ShootGarment = {
  garments: {
    brand_id: {
      slug: string;
    } | null;
    garment_types: {
      name: string;
    } | null;
  } | null;
};

type BrandShoot = {
  id: number;
  name: string;
  slug: string;
  publication_date: string;
  stylist: {
    name: string;
    slug: string;
  } | null;
  city: {
    name: string;
  } | null;
  shoot_style_tags: {
    style_tags: {
      name: string;
      slug: string;
    };
  }[];
  shoot_images: {
    image_url: string;
  }[];
  shoot_garments: ShootGarment[];
};

export default async function BrandPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand: brandParam } = await params;
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

  const transformedShoots = (brandShootsData as BrandShoot[] | null)?.map(
    (shoot: BrandShoot) => {
      const { shoot_images, shoot_garments, ...shootWithoutImages } = shoot;

      const garmentTypes = (shoot_garments ?? [])
        .filter((sg) => sg.garments?.brand_id?.slug === brandParam)
        .map((sg) => sg.garments?.garment_types?.name)
        .filter(Boolean);

      const uniqueGarmentTypes = [...new Set(garmentTypes)];

      return {
        ...shootWithoutImages,
        city: { name: shoot.city?.name },
        shoot_style_tags: shoot.shoot_style_tags?.map((tag) => ({
          name: tag.style_tags.name,
          slug: tag.style_tags.slug,
        })),
        first_image: shoot_images?.[0]?.image_url || "",
        brandItemTypes: uniqueGarmentTypes,
      };
    },
  );

  return (
    <div>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.brandHeader}>
            <div className={styles.brandHeaderLeft}>
              <h1>{brandData?.name}</h1>
              {brandData?.instagram_url && (
                <Link
                  href={brandData.instagram_url ?? ""}
                  target="_blank"
                  className={styles.instaIcon}
                >
                  <Insta />
                </Link>
              )}
            </div>
            <div className={styles.brandHeaderRight}>
              <div className={styles.itemShootCount}>
                {garmentsData?.length}{" "}
                {garmentsData?.length === 1 ? "item" : "items"}
              </div>
              <div className={styles.itemShootCount}>
                {transformedShoots?.length}{" "}
                {transformedShoots?.length === 1 ? "shoot" : "shoots"}
              </div>
            </div>
          </div>
          <div className={styles.cardsContainer}>
            {transformedShoots?.map((shoot) => (
              <CardWithItems
                key={shoot.id}
                shoot={shoot as unknown as CardWithItemsType}
                brand={brandData?.name}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
