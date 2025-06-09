import { LatestShoot, LatestList } from "./latest";
import { shoots } from "./@data";
import styles from "./page.module.css";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: supabaseShoots } = await supabase
    .from("shoots")
    .select(
      `
      name,
      slug,
      publication_date,
      description,
      stylist:stylists!stylist_id (name, instagram_url, slug, description),
      city:cities!city_id (
        name,
        country:countries!country_id (name)
      ),
      shoot_garments (
        garments (name),
        brand:garments (brands!brand_id (name, slug, instagram_url)),
        garment_type:garments (garment_types!garment_type_id (name))
      ),
      shoot_style_tags (
        style_tags (name)
      ),
      shoot_images (
        image_url
      )
    `,
    )
    .order("publication_date", { ascending: false });

  const transformedShoots = supabaseShoots?.map((shoot) => ({
    ...shoot,
    city: {
      name: (shoot.city as any)?.name,
      country: (shoot.city as any)?.country?.name,
    },
    shoot_style_tags: shoot.shoot_style_tags?.map(
      (tag) => (tag.style_tags as any).name,
    ),
    shoot_garments: shoot.shoot_garments?.map((sg) => ({
      name: (sg.garments as any).name,
      brand: (sg.brand as any).brands,
      garment_type: (sg.garment_type as any).garment_types.name,
    })),
  }));

  console.log(transformedShoots);

  const latestShoot = shoots[0];
  return (
    <div>
      <main className={styles.main}>
        <LatestShoot latestShootData={latestShoot} />
        <LatestList />
      </main>
    </div>
  );
}
