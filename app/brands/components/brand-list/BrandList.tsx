import Link from "next/link";
import { slugify } from "@/app/@utils";
import { brands } from "../../@data";
import { shoots } from "../../../@data";
import styles from "./BrandList.module.css";

const BrandList = () => {
  const brandCounts = Object.keys(brands).reduce<Record<string, number>>(
    (counts, brand) => {
      let count = 0;
      shoots.forEach((shoot) => {
        if (shoot.items) {
          count += shoot.items.filter(
            (item) => item.brand === brands[brand as keyof typeof brands].name,
          ).length;
        }
      });
      return { ...counts, [brand]: count };
    },
    {},
  );

  const getShootsWithBrand = (brandName: string) => {
    return shoots.filter((shoot) =>
      shoot.items?.some(
        (item) => item.brand === brands[brandName as keyof typeof brands].name,
      ),
    );
  };

  return (
    <div className={styles.brandList}>
      {Object.keys(brands)
        .sort((a, b) => a.localeCompare(b))
        .map((brand) => (
          <Link href={`/brands/${slugify(brand)}`} key={brand}>
            <div key={brand} className={styles.brandRow}>
              <div className={styles.brandRowName}>{brand}</div>
              <div className={styles.brandRowInfo}>
                <div>
                  <span className={styles.brandRowInfoNumber}>
                    {brandCounts[brand]}
                  </span>
                  <span>{brandCounts[brand] === 1 ? "Item" : "Items"}</span>
                </div>
                <div>
                  <span className={styles.brandRowInfoNumber}>
                    {getShootsWithBrand(brand).length}
                  </span>
                  <span>
                    {getShootsWithBrand(brand).length === 1
                      ? "Shoot"
                      : "Shoots"}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
};

export default BrandList;
