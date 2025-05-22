"use client";
import Image from "next/image";
import { ImgList } from "./@ui";
import styles from "./SlideshowHero.module.css";
import { ShootType } from "@/app/@data";
import { FC, useState } from "react";

type SlideshowHeroProps = {
  shootData: ShootType;
};

const SlideshowHero: FC<SlideshowHeroProps> = ({ shootData }) => {
  const { imgs, details } = shootData;
  const [currentImg, setCurrentImg] = useState(imgs[0]);
  return (
    <div className={styles.container} data-testid="slideshow-hero">
      <div className={styles.innerContainer}>
        <div className={styles.imageContainer}>
          <div className={styles.shadeGradient} data-testid="shade-gradient" />
          <Image
            src={currentImg}
            alt={`${details.title} - ${details.date} `}
            fill
            className={styles.image}
            data-testid="image"
          />
          <Image
            src={currentImg}
            alt={`${details.title} - ${details.date} Blurred`}
            fill
            className={styles.imageBlur}
            data-testid="image-blur"
          />
        </div>
        <ImgList
          shootData={shootData}
          currentImg={currentImg}
          setCurrentImg={setCurrentImg}
        />
      </div>
    </div>
  );
};

export default SlideshowHero;
