import { FC } from "react";
import styles from "./ImgList.module.css";
import Image from "next/image";
import { ShootType } from "@/app/@data";

const ImgList: FC<{
  shootData: ShootType;
  currentImg: string;
  setCurrentImg: (img: string) => void;
}> = ({ shootData, currentImg, setCurrentImg }) => {
  const {
    imgs,
    details: { date, city, stylist, title },
  } = shootData;

  const scrollToDetails = () => {
    const detailsElement = document.getElementById("info");
    if (detailsElement) {
      detailsElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={styles.container} data-testid="details">
      <div className={styles.box} data-testid="details-box">
        <div className={styles.boxHeader}>
          <span>{date}</span>
          <span>{city}</span>
        </div>
        <h1 className={styles.boxTitle}>
          <div>{title}:</div>
          <div>{stylist}</div>
        </h1>
        <button className={styles.scrollToDetailsBtn} onClick={scrollToDetails}>
          Scroll To Details
        </button>
      </div>
      {imgs.map((img) => (
        <div
          key={img}
          className={
            img === currentImg
              ? styles.imgContainer_active
              : styles.imgContainer
          }
          data-testid="img"
          onClick={() => setCurrentImg(img)}
        >
          <Image src={img} alt="img" fill />
        </div>
      ))}
    </div>
  );
};

export default ImgList;
