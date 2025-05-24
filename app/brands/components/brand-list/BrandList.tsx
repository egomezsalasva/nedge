import Link from "next/link";
import { slugify } from "@/app/@utils";
import { brands } from "../../@data";
import { shoots } from "../../../@data";
import { createItemsCounter, createShootsCounter } from "../../@utils";
import styles from "./BrandList.module.css";

const BrandList = () => {
  const itemCount = createItemsCounter(brands, shoots);
  const shootCount = createShootsCounter(brands, shoots);

  return (
    <div className={styles.brandList} data-testid="brand-list">
      {Object.keys(brands)
        .sort((a, b) => a.localeCompare(b))
        .map((brand) => (
          <Link href={`/brands/${slugify(brand)}`} key={brand}>
            <div key={brand} className={styles.brandRow}>
              <div className={styles.brandRowName}>{brand}</div>
              <div className={styles.brandRowInfo}>
                <div>
                  <span className={styles.brandRowInfoNumber}>
                    {itemCount(brand)}
                  </span>
                  <span>{itemCount(brand) === 1 ? "Item" : "Items"}</span>
                </div>
                <div>
                  <span className={styles.brandRowInfoNumber}>
                    {shootCount(brand)}
                  </span>
                  <span>{shootCount(brand) === 1 ? "Shoot" : "Shoots"}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
};

export default BrandList;
