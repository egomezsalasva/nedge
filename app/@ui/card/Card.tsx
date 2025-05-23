import { FC } from "react";
import Link from "next/link";
import { slugify } from "../../@utils";
import { ShootType } from "@/app/@data";
import styles from "./Card.module.css";

const Card: FC<{ shoot: ShootType }> = ({ shoot }) => {
  const {
    imgs,
    details: { title, date, city, tags, stylist },
  } = shoot;
  return (
    <div data-testid="shoot-card" className={styles.cardContainer}>
      <div className={styles.card}>
        <Link href={`/stylists/${slugify(stylist)}/${slugify(title)}`}>
          <img src={imgs[0]} alt={title} />
        </Link>
        <div className={styles.detailsContainer}>
          <div className={styles.detailsTop}>
            <div>{date}</div>
            <div>{city}</div>
          </div>
          <Link href={`/stylists/${slugify(stylist)}/${slugify(title)}`}>
            <h3>{`${title}:  ${stylist}`}</h3>
          </Link>
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
