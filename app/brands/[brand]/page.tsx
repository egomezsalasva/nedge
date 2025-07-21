import Link from "next/link";
import { notFound } from "next/navigation";
import CardWithItems, {
  CardWithItemsType,
} from "@/app/ui/card-with-items/CardWithItems";
import { Insta } from "@/app/svgs";
import { getShootsFromBrandData } from "./@utils/getShootsFromBrandData";
import styles from "./page.module.css";

export default async function BrandPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand: brandParam } = await params;
  const { brandData, garmentsData, transformedShoots } =
    await getShootsFromBrandData(brandParam);

  if (!transformedShoots || transformedShoots.length === 0) {
    notFound(); // or return <div>No public shoots for this brand.</div>
  }

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
                <span className={styles.infoNumber}>
                  {garmentsData?.length}
                </span>
                <span>{garmentsData?.length === 1 ? "item" : "items"}</span>
              </div>
              <div className={styles.itemShootCount}>
                <span className={styles.infoNumber}>
                  {transformedShoots?.length}
                </span>
                <span>
                  {transformedShoots?.length === 1 ? "shoot" : "shoots"}
                </span>
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
