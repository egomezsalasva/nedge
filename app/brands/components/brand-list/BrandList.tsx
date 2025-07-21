import { getBrandListData } from "./@utils/getBrandListData";
import Link from "next/link";
import styles from "./BrandList.module.css";

export default async function BrandList() {
  const brands = await getBrandListData();

  return (
    <div className={styles.brandList} data-testid="brand-list">
      {brands
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((brand) => (
          <Link href={`/brands/${brand.slug}`} key={brand.id}>
            <div className={styles.brandRow}>
              <div className={styles.brandRowName}>{brand.name}</div>
              <div className={styles.brandRowInfo}>
                <div>
                  <span className={styles.brandRowInfoNumber}>
                    {brand.itemCount}
                  </span>
                  <span>{brand.itemCount === 1 ? "Item" : "Items"}</span>
                </div>
                <div>
                  <span className={styles.brandRowInfoNumber}>
                    {brand.shootCount}
                  </span>
                  <span>{brand.shootCount === 1 ? "Shoot" : "Shoots"}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
}
