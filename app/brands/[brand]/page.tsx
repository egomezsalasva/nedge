import { notFound } from "next/navigation";
import { shoots } from "@/app/@data";
import { brands } from "../@data";
import CardWithItems from "@/app/@ui/card-with-items/CardWithItems";
import Link from "next/link";
import { getBrandBySlug, getBrandShoots, getBrandItemsType } from "./@utils";
import { createItemsCounter } from "../@utils";
import styles from "./page.module.css";

export default async function BrandPage({
  params,
}: {
  params: { brand: string };
}) {
  const { key: brandKey, data: brandData } = getBrandBySlug(params.brand);
  const brandShoots = getBrandShoots(brandData.name);
  const itemsCount = createItemsCounter(brands, shoots);

  if (!brandData) {
    notFound();
  }

  return (
    <div>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.brandHeader}>
            <div className={styles.brandHeaderLeft}>
              <h1>{brandData.name}</h1>
              <Link
                href={`https://www.instagram.com/${brandData.instagram}`}
                target="_blank"
                className={styles.instaIcon}
              >
                Insta
              </Link>
            </div>
            <div className={styles.brandHeaderRight}>
              <div className={styles.itemShootCount}>
                {itemsCount(brandKey)}{" "}
                {itemsCount(brandKey) === 1 ? "item" : "items"}
              </div>
              <div className={styles.itemShootCount}>
                {brandShoots.length}{" "}
                {brandShoots.length === 1 ? "shoot" : "shoots"}
              </div>
            </div>
          </div>
          <div className={styles.cardsContainer}>
            {brandShoots.map((shoot) => (
              <CardWithItems
                key={shoot.details.title}
                shoot={shoot}
                brand={brandData.name}
                brandItemsType={getBrandItemsType(shoot, brandData.name)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
