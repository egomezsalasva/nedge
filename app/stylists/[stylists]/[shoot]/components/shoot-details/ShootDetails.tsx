"use client";
import { FC } from "react";
import { ShootType } from "@/app/@data";
import styles from "./ShootDetails.module.css";
import { useUserContext } from "@/app/@contexts/UserContext";
import { slugify } from "@/app/@utils";
import { Bookmark } from "@/app/@svgs";

type ShootDetailsProps = {
  shootData: ShootType;
};

const ShootDetails: FC<ShootDetailsProps> = ({ shootData }) => {
  const { details, team } = shootData;
  const {
    addBookmark,
    removeBookmark,
    bookmarks,
    addFollowing,
    removeFollowing,
    following,
  } = useUserContext();

  const isFollowing = following.some(
    (following) => following.name === details.stylist,
  );

  return (
    <div className={styles.container} data-testid="shoot-details">
      <div className={styles.headerContainer}>
        <div className={styles.headerInfo}>
          <span>{details.date}</span>
          <span>{details.city}</span>
        </div>
        <button
          className={styles.bookmarkBtn}
          onClick={() => {
            if (
              bookmarks.some(
                (bookmark) => bookmark.details.title === details.title,
              )
            ) {
              removeBookmark(shootData);
            } else {
              addBookmark(shootData);
            }
          }}
          data-testid="bookmark"
        >
          {bookmarks.some(
            (bookmark) => bookmark.details.title === details.title,
          ) ? (
            <Bookmark fill="currentColor" />
          ) : (
            <Bookmark />
          )}
        </button>
      </div>
      <div className={styles.stylistContainer}>
        <div className={styles.stylistHeader}>
          <h2>{details.stylist}</h2>
          {isFollowing ? (
            <button
              className={styles.followBtn_active}
              onClick={() => {
                removeFollowing(details.stylist);
              }}
            >
              Unfollow
            </button>
          ) : (
            <button
              className={styles.followBtn}
              onClick={() => {
                const stylistLink = `/stylists/${slugify(details.stylist)}/${slugify(details.title)}`;
                addFollowing({
                  name: details.stylist,
                  link: stylistLink,
                });
              }}
            >
              Follow
            </button>
          )}
        </div>
        <div>
          <p>{details.stylistDescription}</p>
        </div>
      </div>
      <div className={styles.shootContainer}>
        <h2>{details.title}</h2>
        <ul>
          {details.tags.map((tag) => (
            <li key={tag} className={`tag`}>
              {tag}
            </li>
          ))}
        </ul>
        <p>{details.description}</p>
      </div>
      <div className={styles.teamContainer}>
        <ul>
          {team?.map((member) => (
            <li key={member.name}>
              <span className={styles.teamMemberRole}>{member.role}</span>:{" "}
              <span className={styles.teamMemberName}>{member.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ShootDetails;
