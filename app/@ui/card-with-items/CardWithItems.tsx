import { FC } from "react";
import Link from "next/link";
import { slugify } from "../../@utils";
import { ShootType } from "@/app/@data";
import rootCardStyles from "../card/Card.module.css";
import styles from "./CardWithItems.module.css";

type CardWithItemsProps = {
  shoot: ShootType;
  brand: string;
  brandItemsType: string[];
};

const CardWithItems: FC<CardWithItemsProps> = ({
  shoot,
  brand,
  brandItemsType,
}) => {
  const {
    imgs,
    details: { title, date, city, tags, stylist },
  } = shoot;
  return (
    <div data-testid="shoot-card" className={rootCardStyles.cardContainer}>
      <div className={rootCardStyles.card}>
        <Link href={`/stylists/${slugify(stylist)}/${slugify(title)}`}>
          <img src={imgs[0]} alt={title} />
        </Link>
        <div className={rootCardStyles.detailsContainer}>
          <div className={rootCardStyles.detailsTop}>
            <div>{date}</div>
            <div>{city}</div>
          </div>
          <Link href={`/stylists/${slugify(stylist)}/${slugify(title)}`}>
            <h3>{`${title}:  ${stylist}`}</h3>
          </Link>
        </div>
        <div className={rootCardStyles.tags}>
          {tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div className={styles.brandItemsContainer}>
          <div className={styles.brandItems}>
            <div className={styles.brandName}>{brand}:</div>
            {brandItemsType.map((itemType, index) => (
              <div key={itemType} className={styles.brandItem}>
                {itemType}
                <span className={styles.brandItemSeparator}>
                  {index < brandItemsType.length - 1 && ","}
                </span>
              </div>
            ))}
          </div>
          <div className={styles.brandItemsCount}>{brandItemsType.length}</div>
        </div>
      </div>
    </div>
  );
};

export default CardWithItems;
