"use client";
import { FC, useEffect } from "react";
import Link from "next/link";
import { SlideshowIndicators } from "../";
import { formatDate } from "@/app/utils";
import styles from "./Details.module.css";

export type TransformedShootType = {
  name: string;
  slug: string;
  publication_date: string;
  description: string;
  stylist: { name: string; slug: string } | null;
  city: { name: string | undefined };
  shoot_style_tags: { name: string; slug: string }[];
  shoot_images: { image_url: string }[] | null;
};

export type DetailsProps = {
  shootData: TransformedShootType;
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

  useEffect(() => {
    console.log(
      "shoot_images",
      shoot_images?.map((img) => img.image_url),
    );
  }, [shoot_images]);

  return (
    <div className={styles.container} data-testid="details">
      <div className={styles.body}>
        <div className={styles.header}>
          <span>{formatDate(publication_date)}</span>
          <span>{city.name}</span>
        </div>
        <div className={styles.content}>
          <Link href={`/stylists/${stylist?.slug}/${slug}`}>
            <button className={styles.viewBtn}>VIEW DETAILS</button>
          </Link>
          <div className={styles.box}>
            <div className={styles.title}>
              {name}:
              <br />
              {stylist?.name}
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
        </div>
      </div>
      <SlideshowIndicators
        imgs={shoot_images?.map((img) => img.image_url) || []}
        activeImgIndex={activeImgIndex}
        setActiveImgIndex={setActiveImgIndex}
      />
    </div>
  );
};

export default Details;
