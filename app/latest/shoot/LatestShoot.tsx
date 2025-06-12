"use client";
import { FC, useEffect, useState } from "react";
import Image from "next/image";
import { Details } from "./@ui";
import styles from "./LatestShoot.module.css";
import { imgConstraints } from "./@utils/imgConstraints";

const LatestShoot: FC = () => {
  const [latestShootData, setLatestShootData] = useState<any | null>(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestShoot = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/latest/shoot");
        if (!response.ok) {
          throw new Error(`Failed to fetch latest shoot: ${response.status}`);
        }
        const data = await response.json();
        if (!data || !data.shoot_images || data.shoot_images.length === 0) {
          throw new Error("No shoot images available");
        }
        setLatestShootData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred",
        );
        console.error("Error fetching latest shoot:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLatestShoot();
  }, []);

  useEffect(() => {
    if (latestShootData?.shoot_images) {
      imgConstraints(
        latestShootData.shoot_images.map(
          (img: { image_url: string }) => img.image_url,
        ),
        10,
      );
    }
  }, [latestShootData]);

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.innerContainer}>
          <div className={styles.error}>
            <h2>Unable to Load Latest Shoot</h2>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className={styles.retryButton}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div className={styles.imageContainer}>
          <div className={styles.shadeGradient} data-testid="shade-gradient" />
          {isLoading ? (
            <div className={styles.loadingImg}>Loading...</div>
          ) : (
            <Image
              src={
                latestShootData?.shoot_images[activeImgIndex].image_url || ""
              }
              alt="Latest Shoot"
              fill
            />
          )}
        </div>
        {isLoading ? (
          <div className={styles.loadingDetails}>Loading...</div>
        ) : (
          <Details
            shootData={latestShootData}
            activeImgIndex={activeImgIndex}
            setActiveImgIndex={setActiveImgIndex}
          />
        )}
      </div>
    </div>
  );
};

export default LatestShoot;
