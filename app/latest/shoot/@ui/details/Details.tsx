"use client";
import { FC } from "react";
import Link from "next/link";
import { SlideshowIndicators } from "../";
import { ShootType } from "@/app/@types";
import { formatDate } from "@/app/@utils";
import styles from "./Details.module.css";

export type DetailsProps = {
  shootData: ShootType;
  activeImgIndex: number;
  setActiveImgIndex: (index: number) => void;
};

const Details: FC<DetailsProps> = ({
  shootData,
  activeImgIndex,
  setActiveImgIndex,
}) => {
  const {
    publication_date,
    city,
    name,
    slug,
    stylist,
    shoot_style_tags,
    description,
    shoot_images,
  } = shootData;

  return (
    <div className={styles.container} data-testid="details">
      <div className={styles.header}>
        <span>{formatDate(publication_date)}</span>
        <span>{city.name}</span>
      </div>
      <div className={styles.body}>
        <Link href={`/stylists/${stylist.slug}/${slug}`}>
          <button className={styles.viewBtn}>VIEW DETAILS</button>
        </Link>
        <div className={styles.box}>
          <div className={styles.title}>
            {name}:
            <br />
            {stylist.name}
          </div>
          <div className={styles.tags}>
            {shoot_style_tags.map((tag: { name: string; slug: string }) => (
              <Link
                href={{ pathname: "/explore", query: { substyle: tag.slug } }}
                key={tag.slug}
              >
                <span>{tag.name}</span>
              </Link>
            ))}
          </div>
          <div className={styles.description}>
            <p>{description}</p>
          </div>
        </div>
        <SlideshowIndicators
          imgs={shoot_images.map((img) => img.image_url)}
          activeImgIndex={activeImgIndex}
          setActiveImgIndex={setActiveImgIndex}
        />
      </div>
    </div>
  );
};

export default Details;
