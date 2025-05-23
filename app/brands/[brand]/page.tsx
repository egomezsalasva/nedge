import { notFound } from "next/navigation";
import { slugify } from "@/app/@utils";
import { Card } from "@/app/@ui";
import { shoots } from "@/app/@data";
import { brands } from "../@data";
import styles from "./page.module.css";

export default async function BrandPage({
  params,
}: {
  params: { brand: string };
}) {
  const brandUrl = params.brand;
  const brandName = Object.keys(brands).find((key) => {
    return slugify(key) === brandUrl;
  });
  if (!brandName) {
    notFound();
  }
  const brandShoots = shoots.filter((shoot) =>
    shoot.items?.some(
      (item) => item.brand === brands[brandName as keyof typeof brands].name,
    ),
  );

  return (
    <div>
      <main className={styles.main}>
        <div className={styles.container}>
          <h1>{brandName}</h1>
          <div className={styles.cardsContainer}>
            {brandShoots.map((shoot) => (
              <Card key={shoot.details.title} shoot={shoot} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
