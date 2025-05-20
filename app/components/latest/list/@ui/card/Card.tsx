import { ShhotType } from "@/app/@data";
import styles from "./Card.module.css";
import { FC } from "react";

const Card: FC<{ shoot: ShhotType }> = ({ shoot }) => {
  const {
    imgs,
    details: { title, date, city, tags, stylist },
  } = shoot;
  return (
    <div data-testid="shoot-card" className={styles.cardContainer}>
      <div className={styles.card}>
        <img src={imgs[0]} alt={title} />
        <div className={styles.detailsContainer}>
          <div className={styles.detailsTop}>
            <div>{date}</div>
            <div>{city}</div>
          </div>
          <h3>{`${title}:  ${stylist}`}</h3>
        </div>
        <div className={styles.tags}>
          {tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Card;
