"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import RemoveGarmentButton from "./@ui/RemoveGarmentButton";

type GarmentItem = {
  garment_id: number;
  garments: {
    brands: { name: string };
    garment_type: { name: string };
    name: string;
  };
  source_pathname: string;
};

export default function AccountMyWardrobe() {
  const [wardrobe, setWardrobe] = useState<GarmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWardrobe = async () => {
      const res = await fetch("/api/account/my-wardrobe");
      if (!res.ok) {
        setWardrobe([]);
        setLoading(false);
        return;
      }
      const { wardrobe } = await res.json();
      setWardrobe(wardrobe || []);
      setLoading(false);
    };

    fetchWardrobe();
  }, []);

  const makeGroupedWardrobe = (wardrobe: GarmentItem[]) =>
    wardrobe.reduce(
      (acc: Record<string, GarmentItem[]>, item: GarmentItem) => {
        const type = item.garments?.garment_type?.name || "Other";
        if (!acc[type]) {
          acc[type] = [];
        }
        const isDuplicate = acc[type].some(
          (existingItem: GarmentItem) =>
            existingItem.garments.name === item.garments?.name &&
            existingItem.garments.brands?.name === item.garments?.brands?.name,
        );
        if (!isDuplicate) {
          acc[type].push(item);
        }
        return acc;
      },
      {} as Record<string, typeof wardrobe>,
    );

  const [groupedWardrobe, setGroupedWardrobe] = useState<
    Record<string, GarmentItem[]>
  >({});
  useEffect(() => {
    const groupedWardrobe = makeGroupedWardrobe(wardrobe);
    setGroupedWardrobe(groupedWardrobe);
  }, [wardrobe]);

  const addS = (word: string) => {
    if (word.endsWith("s")) {
      return word;
    }
    return word + "s";
  };

  return (
    <div>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : wardrobe.length === 0 ? (
          <p>No wardrobe items yet</p>
        ) : (
          <div className={styles.followingContainer}>
            {Object.entries(groupedWardrobe).map(([type, items]) => (
              <div key={type} className={styles.typeGroup}>
                <h2 className={styles.typeTitle}>{addS(type)}</h2>
                {items.map((item: GarmentItem) => (
                  <div key={item.garment_id} className={styles.garmentRow}>
                    <Link
                      href={item.source_pathname}
                      className={styles.garmentLink}
                    >
                      <div className={styles.garmentName}>
                        {item.garments.name}
                      </div>
                      <div className={styles.garmentBrand}>
                        {item.garments.brands.name}
                      </div>
                    </Link>
                    <RemoveGarmentButton garmentId={item.garment_id} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
