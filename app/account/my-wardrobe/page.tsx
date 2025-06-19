"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { createClient } from "@/utils/supabase/client";
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
  const supabase = createClient();
  const [wardrobe, setWardrobe] = useState<GarmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWardrobe = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();
      if (profileError || !profile) {
        setLoading(false);
        return;
      }
      const { data: wardrobeData, error: wardrobeError } = await supabase
        .from("profile_garments")
        .select(
          `
        garment_id,
        source_pathname,
        garments (
          name,
          brands:brand_id (name),
          garment_type:garment_type_id (name)
        )
      `,
        )
        .eq("profile_id", profile.id);
      if (wardrobeError) {
        setLoading(false);
        return;
      }
      setWardrobe((wardrobeData as unknown as GarmentItem[]) || []);
      setLoading(false);
    };

    fetchWardrobe();
  }, [supabase]);

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
