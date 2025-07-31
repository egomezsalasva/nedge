import { FC } from "react";
import { ShootType } from "@/app/types";
import { formatDate } from "@/app/utils";
import { Insta } from "@/app/svgs";
import Link from "next/link";
import BookmarkButton from "./@ui/BookmarkButton";
import styles from "./ShootDetails.module.css";

type ShootDetailsProps = {
  shootData: ShootType;
};

const ShootDetails: FC<ShootDetailsProps> = ({ shootData }) => {
  const {
    id,
    name,
    publication_date,
    city,
    description,
    shoot_style_tags,
    stylist,
  } = shootData;

  return (
    <div className={styles.container} data-testid="shoot-details">
      <div className={styles.headerContainer}>
        <div className={styles.headerInfo}>
          <span>{formatDate(publication_date)}</span>
          <span>{city.name}</span>
        </div>
        <BookmarkButton shootId={id} />
      </div>
      <div className={styles.stylistContainer}>
        <div className={styles.stylistHeader}>
          <h2>{stylist.name}</h2>
          {stylist.instagram_url && (
            <Link
              href={stylist.instagram_url}
              target="_blank"
              className={styles.instaLink}
            >
              <Insta />
            </Link>
          )}
        </div>
        {stylist.description && (
          <div className={styles.stylistDescriptionContainer}>
            <p>{stylist.description}</p>
          </div>
        )}
      </div>
      <div className={styles.shootContainer}>
        <h2>{name}</h2>
        <ul>
          {shoot_style_tags.map((tag: { name: string; slug: string }) => (
            <li key={tag.slug}>
              <Link
                href={{ pathname: "/explore", query: { substyle: tag.slug } }}
                className={`tag`}
              >
                {tag.name}
              </Link>
            </li>
          ))}
        </ul>
        <p>{description}</p>
      </div>
      {/* <div className={styles.teamContainer}>
        <ul>
          {team?.map((member) => (
            <li key={member.name}>
              <span className={styles.teamMemberRole}>{member.role}</span>:{" "}
              <span className={styles.teamMemberName}>{member.name}</span>
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
};

export default ShootDetails;
