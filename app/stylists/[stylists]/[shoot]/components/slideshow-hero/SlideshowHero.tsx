"use client";
import Image from "next/image";
import { ImgList } from "./@ui";
import styles from "./SlideshowHero.module.css";
import { FC, useState } from "react";
import { ShootType } from "@/app/@types";

type SlideshowHeroProps = {
  shootData: ShootType;
};

const SlideshowHero: FC<SlideshowHeroProps> = ({ shootData }) => {
  const { shoot_images, name, publication_date } = shootData;
  const [currentImg, setCurrentImg] = useState(shoot_images[0].image_url);
  return (
    <div className={styles.container} data-testid="slideshow-hero">
      <div className={styles.innerContainer}>
        <div className={styles.imageContainer}>
          <div className={styles.shadeGradient} data-testid="shade-gradient" />
          <Image
            src={currentImg}
            alt={`${name} - ${publication_date} `}
            fill
            className={styles.image}
            data-testid="image"
          />
          <Image
            src={currentImg}
            alt={`${name} - ${publication_date} Blurred`}
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
