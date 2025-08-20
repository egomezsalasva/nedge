"use client";
import { FC, useCallback } from "react";
import styles from "./ImgList.module.css";
import Image from "next/image";
import { formatDate } from "@/app/utils";
import { ShootType } from "@/app/types";
import posthog from "posthog-js";

type ImgListProps = {
  shootData: ShootType;
  currentImg: string;
  setCurrentImg: (img: string) => void;
};

const ImgList: FC<ImgListProps> = ({
  shootData,
  currentImg,
  setCurrentImg,
}) => {
  const { shoot_images, publication_date, city, stylist, name } = shootData;

  const scrollToDetails = () => {
    posthog.capture("my event", { property: "value" });
    const detailsElement = document.getElementById("info");
    if (detailsElement) {
      detailsElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleImgClick = useCallback(
    (imgUrl: string) => {
      if (imgUrl !== currentImg) {
        setCurrentImg(imgUrl);
      }
    },
    [currentImg, setCurrentImg],
  );

  return (
    <div className={styles.container} data-testid="details">
      <div className={styles.box} data-testid="details-box">
        <div className={styles.boxHeader}>
          <span>{formatDate(publication_date)}</span>
          <span>{city?.name || "Unknown City"}</span>
        </div>
        <h1 className={styles.boxTitle}>
          <div>{name}:</div>
          <div>{stylist?.name || "Unknown Stylist"}</div>
        </h1>
        <button className={styles.scrollToDetailsBtn} onClick={scrollToDetails}>
          Scroll To Details
        </button>
      </div>
      {shoot_images?.map((img: { image_url: string }) => (
        <div
          key={img.image_url}
          className={
            img.image_url === currentImg
              ? styles.imgContainer_active
              : styles.imgContainer
          }
          data-testid="img"
          onClick={() => handleImgClick(img.image_url)}
        >
          <Image src={img.image_url} alt="img" fill />
        </div>
      ))}
    </div>
  );
};

export default ImgList;
