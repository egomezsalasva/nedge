import Image from "next/image";
import { Details } from "./@ui";
import { imgConstraints } from "./@utils/imgConstraints";
import { getLatestShootData } from "./@utils/getLatestShootData";
import styles from "./LatestShoot.module.css";

const LatestShoot = async () => {
  const latestShootData = await getLatestShootData();

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
            src={latestShootData.shoot_images?.[0]?.image_url || ""}
            alt="Latest Shoot"
            fill
          />
        </div>
        <Details shootData={latestShootData} />
      </div>
    </div>
  );
};

export default LatestShoot;
