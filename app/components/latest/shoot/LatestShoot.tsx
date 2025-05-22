"use client";
import { FC, useState } from "react";
import Image from "next/image";
import { Details } from "./@ui";
import { imgConstraints } from "./@utils/imgConstraints";
import styles from "./LatestShoot.module.css";
import { ShootType } from "@/app/@data";

type LatestShootProps = {
  latestShootData: ShootType;
};

const LatestShoot: FC<LatestShootProps> = ({ latestShootData }) => {
  const { imgs, details } = latestShootData;
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  imgConstraints(imgs, 10);
  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div className={styles.imageContainer}>
          <div className={styles.shadeGradient} data-testid="shade-gradient" />
          <Image src={imgs[activeImgIndex]} alt="Latest Shoot" fill />
        </div>
        <Details
          imgs={imgs}
          details={details}
          activeImgIndex={activeImgIndex}
          setActiveImgIndex={setActiveImgIndex}
        />
      </div>
    </div>
  );
};

export default LatestShoot;
