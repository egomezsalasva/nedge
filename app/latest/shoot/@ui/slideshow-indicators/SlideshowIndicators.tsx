import { FC } from "react";
import styles from "./SlideshowIndicators.module.css";
import { Arrow } from "@/app/svgs";

type SlideshowIndicatorsProps = {
  imgs: string[];
  activeImgIndex: number;
  setActiveImgIndex: (index: number) => void;
};

const SlideshowIndicators: FC<SlideshowIndicatorsProps> = ({
  imgs,
  activeImgIndex,
  setActiveImgIndex,
}) => {
  const prevHandler = () => {
    if (activeImgIndex > 0) {
      setActiveImgIndex(activeImgIndex - 1);
    } else {
      setActiveImgIndex(imgs.length - 1);
    }
  };
  const nextHandler = () => {
    if (activeImgIndex < imgs.length - 1) {
      setActiveImgIndex(activeImgIndex + 1);
    } else {
      setActiveImgIndex(0);
    }
  };
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.line} />
        {imgs.map((_, index) => (
          <div
            key={index}
            data-testid="indicator"
            className={`${styles.indicator} ${
              activeImgIndex === index ? styles.indicator_active : ""
            }`}
          />
        ))}
      </div>
      <div className={styles.navContainer}>
        <div className={styles.nav}>
          <div
            onClick={prevHandler}
            className={styles.navBtn}
            data-testid="previous-button"
          >
            <Arrow className={styles.arrowLeft} />
          </div>
          <div
            onClick={nextHandler}
            className={styles.navBtn}
            data-testid="next-button"
          >
            <Arrow className={styles.arrowRight} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideshowIndicators;
