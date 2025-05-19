import { FC } from "react";
import Link from "next/link";
import { SlideshowIndicators } from "../";
import { ShhotType } from "@/app/@data";
import styles from "./Details.module.css";

export type DetailsProps = ShhotType & {
  activeImgIndex: number;
  setActiveImgIndex: (index: number) => void;
};

const Details: FC<DetailsProps> = ({
  imgs,
  details,
  activeImgIndex,
  setActiveImgIndex,
}) => {
  const { date, city, title, stylist, tags, description } = details;
  const slugify = (str: string) => {
    return str.toLowerCase().replace(/ /g, "-");
  };
  return (
    <div className={styles.container} data-testid="details">
      <div className={styles.header}>
        <span>{date}</span>
        <span>{city}</span>
      </div>
      <div className={styles.body}>
        <Link href={`/${slugify(stylist)}/${slugify(title)}`}>
          <button className={styles.viewBtn}>VIEW DETAILS</button>
        </Link>
        <div className={styles.box}>
          <div className={styles.title}>
            {title}:
            <br />
            {stylist}
          </div>
          <div className={styles.tags}>
            {tags.map((tag: string) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className={styles.description}>
            <p>{description}</p>
          </div>
        </div>
        <SlideshowIndicators
          imgs={imgs}
          activeImgIndex={activeImgIndex}
          setActiveImgIndex={setActiveImgIndex}
        />
      </div>
    </div>
  );
};

export default Details;
