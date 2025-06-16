"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./BrandList.module.css";

const BrandList = () => {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/brands/brands-with-counts");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setBrands(data);
      } catch (err: any) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
};

export default BrandList;
