import { FC } from "react";
import Link from "next/link";
import { formatDate } from "@/app/@utils";
import styles from "./Card.module.css";
import { ShootType } from "@/app/@types";

export type CardType = ShootType & { first_image: string };

type CardProps = {
  shoot: CardType;
};

const Card: FC<CardProps> = ({ shoot }) => {
  return (
    <div data-testid="shoot-card" className={styles.cardContainer}>
      <div className={styles.card}>
        <Link href={`/stylists/${shoot.stylist.slug}/${shoot.slug}`}>
          <img src={shoot.first_image} alt={shoot.name} />
        </Link>
        <div className={styles.detailsContainer}>
          <div className={styles.detailsTop}>
            <div>{formatDate(shoot.publication_date)}</div>
            <div>{shoot.city.name}</div>
          </div>
          <Link href={`/stylists/${shoot.stylist.slug}/${shoot.slug}`}>
            <h3>
              {shoot.name}
              <span className={styles.detailsSeparator}>:</span>{" "}
              <span>{shoot.stylist.name}</span>
            </h3>
          </Link>
        </div>
        <div className={styles.tags}>
          {shoot.shoot_style_tags?.map((tag: string) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Card;
