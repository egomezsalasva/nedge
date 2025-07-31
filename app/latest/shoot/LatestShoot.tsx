"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Details, TransformedShootType } from "./@ui";
import { imgConstraints } from "./@utils/imgConstraints";
import { getLatestShootData } from "./@utils/getLatestShootData";
import styles from "./LatestShoot.module.css";

const LatestShoot = () => {
  const [latestShootData, setLatestShootData] =
    useState<TransformedShootType | null>(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getLatestShootData();
        setLatestShootData(data);
      } catch (error) {
        console.error("Failed to load latest shoot data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.innerContainer}>
          <div className={styles.loadingImg}>
            <p>Loading...</p>
          </div>
          <div className={styles.loadingDetails}>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!latestShootData) {
    return (
      <div className={styles.container}>
        <div className={styles.innerContainer}>
          <div className={styles.error}>
            <h2>Unable to Load Latest Shoot</h2>
            <p>No shoot data available</p>
          </div>
        </div>
      </div>
    );
  }

  if (latestShootData.shoot_images) {
    imgConstraints(
      latestShootData.shoot_images.map(
        (img: { image_url: string }) => img.image_url,
      ),
      10,
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div className={styles.imageContainer}>
          <div className={styles.shadeGradient} data-testid="shade-gradient" />
          <Image
            src={
              latestShootData.shoot_images?.[activeImgIndex]?.image_url || ""
            }
            alt="Latest Shoot"
            fill
          />
        </div>
        <Details
          shootData={latestShootData}
          activeImgIndex={activeImgIndex}
          setActiveImgIndex={setActiveImgIndex}
        />
      </div>
    </div>
  );
};

export default LatestShoot;
