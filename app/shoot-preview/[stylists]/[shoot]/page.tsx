import { notFound } from "next/navigation";
import {
  GarmsList,
  ShootDetails,
  SlideshowHero,
} from "@/app/stylists/[stylists]/[shoot]/components";
import { getShootData } from "@/app/stylists/[stylists]/[shoot]/@utils/getShootData";
import styles from "@/app/stylists/[stylists]/[shoot]/page.module.css";

export default async function Shoot({
  params,
}: {
  params: Promise<{ stylists: string; shoot: string }>;
}) {
  const { stylists, shoot } = await params;
  const shootData = await getShootData(stylists, shoot);

  if (!shootData || !shootData.preview_slug?.trim()) {
    notFound();
  }

  return (
    <div>
      <main className={styles.main}>
        <SlideshowHero shootData={shootData} />
        <div className={styles.infoContainer} id="info">
          <GarmsList garmsData={shootData.shoot_garments || []} />
          <ShootDetails shootData={shootData} />
        </div>
      </main>
    </div>
  );
}
