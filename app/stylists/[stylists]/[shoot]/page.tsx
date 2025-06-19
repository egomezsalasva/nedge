import { notFound } from "next/navigation";
import { GarmsList, ShootDetails, SlideshowHero } from "./components";
import styles from "./page.module.css";
import { headers } from "next/headers";

type ShootPageProps = {
  params: Promise<{ stylists: string; shoot: string }>;
};

export default async function Shoot({ params }: ShootPageProps) {
  const { stylists, shoot } = await params;
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  let transformedShoot;
  try {
    const response = await fetch(
      `${protocol}://${host}/api/stylists/${stylists}/${shoot}`,
      {
        cache: "no-store",
      },
    );
    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    transformedShoot = await response.json();
  } catch (error) {
    console.error("Error fetching shoot data:", error);
    notFound();
  }
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
