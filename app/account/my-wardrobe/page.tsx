"use client";
import { useEffect, useState } from "react";
import { useUserContext } from "@/app/@contexts/UserContext";
import Link from "next/link";
import { Bin } from "@/app/@svgs";
import styles from "./page.module.css";

export default function AccountMyWardrobe() {
  const { wardrobe, removeWardrobeItem } = useUserContext();
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return <div>Loading...</div>;
  }

  const groupedWardrobe = wardrobe.reduce(
    (acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      const isDuplicate = acc[item.type].some(
        (existingItem) =>
          existingItem.name === item.name && existingItem.brand === item.brand,
      );
      if (!isDuplicate) {
        acc[item.type].push(item);
      }
      return acc;
    },
    {} as Record<string, typeof wardrobe>,
  );

  const addS = (word: string) => {
    if (word.endsWith("s")) {
      return word;
    }
    return word + "s";
  };

  return (
    <div>
      <div>
        {wardrobe.length === 0 ? (
          <p>No wardrobe items yet</p>
        ) : (
          <div className={styles.followingContainer}>
            {Object.entries(groupedWardrobe).map(([type, items]) => (
              <div key={type} className={styles.typeGroup}>
                <h2 className={styles.typeTitle}>{addS(type)}</h2>
                {items.map((item) => (
                  <div key={item.id} className={styles.garmentRow}>
                    <Link
                      href={`${item.sourceShootLink}#${item.id}`}
                      className={styles.garmentLink}
                    >
                      <div className={styles.garmentName}>{item.name}</div>
                      <div className={styles.garmentBrand}>{item.brand}</div>
                    </Link>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeWardrobeItem(item.id)}
                    >
                      <Bin />
                    </button>
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
