import { FC } from "react";
import Link from "next/link";
import rootCardStyles from "../card/Card.module.css";
import styles from "./CardWithItems.module.css";

export type CardWithItemsType = {
  id: string;
  name: string;
  publication_date: string;
  city: { name: string };
  stylist: { name: string; slug: string };
  shoot_style_tags: { name: string; slug: string }[];
  first_image: string;
  slug: string;
  brandItemTypes: string[];
};

type CardWithItemsProps = {
  shoot: CardWithItemsType;
  brand: string;
};

const CardWithItems: FC<CardWithItemsProps> = ({ shoot, brand }) => {
  const {
    name,
    publication_date,
    city,
    stylist,
    shoot_style_tags,
    first_image,
    slug,
    brandItemTypes,
  } = shoot;
  return (
    <div data-testid="shoot-card" className={rootCardStyles.cardContainer}>
      <div className={rootCardStyles.card}>
        <Link href={`/stylists/${stylist.slug}/${slug}`}>
          <img src={first_image} alt={name} />
        </Link>
        <div className={rootCardStyles.detailsContainer}>
          <div className={rootCardStyles.detailsTop}>
            <div>{publication_date}</div>
            <div>{city.name}</div>
          </div>
          <Link href={`/stylists/${stylist.slug}/${slug}`}>
            <h3>{`${name}:  ${stylist.name}`}</h3>
          </Link>
        </div>
        <div className={rootCardStyles.tags}>
          {shoot_style_tags?.map((tag: { name: string; slug: string }) => (
            <Link
              href={{ pathname: "/explore", query: { substyle: tag.slug } }}
              key={tag.slug}
            >
              {tag.name}
            </Link>
          ))}
        </div>
        {brand &&
          shoot.shoot_style_tags &&
          shoot.shoot_style_tags.length > 0 && (
            <div className={styles.brandItemsContainer}>
              <div className={styles.brandItems}>
                <div className={styles.brandName}>{brand}:</div>
                {brandItemTypes.map((itemType, index) => (
                  <div key={itemType} className={styles.brandItem}>
                    {itemType}
                    <span className={styles.brandItemSeparator}>
                      {index < brandItemTypes.length - 1 && ","}
                    </span>
                  </div>
                ))}
              </div>
              <div className={styles.brandItemsCount}>
                {brandItemTypes.length}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default CardWithItems;
