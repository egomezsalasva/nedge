"use client";
import { useEffect, useState } from "react";
import { BrandType, getBrandListData } from "./@utils/getBrandListData";
import Link from "next/link";
import styles from "./BrandList.module.css";

export default function BrandList() {
  const [search, setSearch] = useState("");
  const [brands, setBrands] = useState<BrandType[]>([]);

  useEffect(() => {
    const fetchBrands = async () => {
      const brands = await getBrandListData();
      setBrands(brands);
    };
    fetchBrands();
  }, []);

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className={styles.brandListHeader}>
        <h1>Brands</h1>
        <span className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search brands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </span>
      </div>
      <div className={styles.brandList} data-testid="brand-list">
        {filteredBrands
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
    </>
  );
}
