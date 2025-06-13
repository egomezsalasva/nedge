"use client";
import { FC, useEffect, useState } from "react";
import { ShootType } from "@/app/@types";
import styles from "./ShootDetails.module.css";
import { useUserContext } from "@/app/@contexts/UserContext";
import { formatDate } from "@/app/@utils";
import { Bookmark, Insta } from "@/app/@svgs";
import Link from "next/link";

type ShootDetailsProps = {
  shootData: ShootType;
};

const ShootDetails: FC<ShootDetailsProps> = ({ shootData }) => {
  const [mounted, setMounted] = useState(false);
  const {
    name,
    publication_date,
    city,
    description,
    shoot_style_tags,
    stylist,
  } = shootData;
  const {
    // addBookmark,
    // removeBookmark,
    bookmarks,
    // addFollowing,
    // removeFollowing,
    // following,
  } = useUserContext();

  // const isFollowing = following.some(
  //   (following) => following.name === stylist.name,
  // );

  useEffect(() => {
    setMounted(true);
  }, []);

  const isBookmarked = mounted
    ? bookmarks.some((bookmark) => bookmark.details.title === name)
    : false;

  console.log(stylist.instagram_url);

  return (
    <div className={styles.container} data-testid="shoot-details">
      <div className={styles.headerContainer}>
        <div className={styles.headerInfo}>
          <span>{formatDate(publication_date)}</span>
          <span>{city.name}</span>
        </div>
        <button
          className={styles.bookmarkBtn}
          // onClick={() => {
          //   if (bookmarks.some((bookmark) => bookmark.details.title === name)) {
          //     removeBookmark(shootData as ShootType);
          //   } else {
          //     addBookmark(shootData as ShootType);
          //   }
          // }}
          data-testid="bookmark"
        >
          <Bookmark fill={isBookmarked ? "currentColor" : "none"} />
        </button>
      </div>
      <div className={styles.stylistContainer}>
        <div className={styles.stylistHeader}>
          <h2>{stylist.name}</h2>
          <Link
            href={stylist.instagram_url}
            target="_blank"
            className={styles.instaLink}
          >
            <Insta />
          </Link>
          {/* {isFollowing ? (
            <button
              className={styles.followBtn_active}
              onClick={() => {
                removeFollowing(stylist.name);
              }}
            >
              Unfollow
            </button>
          ) : (
            <button
              className={styles.followBtn}
              onClick={() => {
                const stylistLink = `/stylists/${stylist.slug}/${slug}`;
                addFollowing({
                  name: stylist.name,
                  link: stylistLink,
                });
              }}
            >
              Follow
            </button>
          )} */}
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
            <Link
              href={{ pathname: "/explore", query: { substyle: tag.slug } }}
              key={tag.slug}
              className={`tag`}
            >
              {tag.name}
            </Link>
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
