import { notFound } from "next/navigation";
import { headers } from "next/headers";
import CardWithItems, {
  CardWithItemsType,
} from "@/app/@ui/card-with-items/CardWithItems";
import Link from "next/link";
import { Insta } from "@/app/@svgs";
import styles from "./page.module.css";

export default async function BrandPage({
  params,
}: {
  params: { brand: string };
}) {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const res = await fetch(`${protocol}://${host}/api/brands/${params.brand}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    notFound();
  }

  const { brand, garments, shoots } = await res.json();

  return (
    <div>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.brandHeader}>
            <div className={styles.brandHeaderLeft}>
              <h1>{brand.name}</h1>
              {brand.instagram_url && (
                <Link
                  href={brand.instagram_url ?? ""}
                  target="_blank"
                  className={styles.instaIcon}
                >
                  <Insta />
                </Link>
              )}
            </div>
            <div className={styles.brandHeaderRight}>
              <div className={styles.itemShootCount}>
                {garments.length} {garments.length === 1 ? "item" : "items"}
              </div>
              <div className={styles.itemShootCount}>
                {shoots.length} {shoots.length === 1 ? "shoot" : "shoots"}
              </div>
            </div>
          </div>
          <div className={styles.cardsContainer}>
            {shoots.map((shoot: CardWithItemsType) => (
              <CardWithItems key={shoot.id} shoot={shoot} brand={brand.name} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
