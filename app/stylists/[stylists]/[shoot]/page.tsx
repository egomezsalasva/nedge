import { GarmsList, ShootDetails, SlideshowHero } from "./components";
import styles from "./page.module.css";
import { shoots } from "../../../@data";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ stylists: string; shoot: string }>;
};

export default async function Shoot({ params }: Props) {
  const { stylists, shoot } = await params;

  const unSlugify = (slug: string) => {
    return slug.replace(/-/g, " ");
  };

  const matchingShoot = shoots.find(
    (s) =>
      s.details.title.toLocaleLowerCase() ===
        unSlugify(shoot).toLocaleLowerCase() &&
      s.details.stylist.toLocaleLowerCase() ===
        unSlugify(stylists).toLocaleLowerCase(),
  );
  if (!matchingShoot) {
    notFound();
  }

  return (
    <div>
      <main className={styles.main}>
        <SlideshowHero shootData={matchingShoot} />
        <div className={styles.infoContainer} id="info">
          <GarmsList garmsData={matchingShoot.items} />
          <ShootDetails shootData={matchingShoot} />
        </div>
      </main>
    </div>
  );
}
