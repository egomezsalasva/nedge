"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUserContext } from "@/app/@contexts/UserContext";
import { ShootType } from "@/app/@data";
import { slugify } from "@/app/@utils/slugify";
import styles from "./page.module.css";
import { Bin } from "@/app/@svgs";

export default function AccountBookmarks() {
  const { bookmarks, removeBookmark } = useUserContext();
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <div>
        {bookmarks.length === 0 ? (
          <p>No bookmarks yet</p>
        ) : (
          <div className={styles.bookmarksContainer}>
            {bookmarks.map((bookmark: ShootType) => (
              <div
                key={bookmark.details.title}
                className={styles.bookmarkContainer}
              >
                <div className={styles.bookmarkImageContainer}>
                  <Link
                    href={`/stylists/${slugify(bookmark.details.stylist)}/${slugify(bookmark.details.title)}`}
                  >
                    <Image
                      src={bookmark.imgs[0]}
                      alt={bookmark.details.title}
                      fill
                    />
                  </Link>
                </div>
                <div className={styles.bookmarkDetailsContainer}>
                  <Link
                    href={`/stylists/${slugify(bookmark.details.stylist)}/${slugify(bookmark.details.title)}`}
                  >
                    <h2>
                      {bookmark.details.title}:
                      <span>{bookmark.details.stylist}</span>
                    </h2>
                  </Link>
                  <div>
                    <button onClick={() => removeBookmark(bookmark)}>
                      <Bin />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
