import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import RemoveBookmarkButton from "./@ui/RemoveBookmarkButton";
import styles from "./page.module.css";

type BookmarkType = {
  id: number;
  shoot: {
    name: string;
    slug: string;
    stylist: {
      name: string;
      slug: string;
    };
    shoot_images: {
      image_url: string;
    }[];
  };
};

export default async function AccountBookmarks() {
  const supabase = await createClient();
  const { data: bookmarks, error } = await supabase.from("profile_bookmarks")
    .select<string, BookmarkType>(`
    id,
    shoot:shoot_id (
      *,
      stylist:stylists!stylist_id (
        name,
        slug
      ),
      shoot_images (image_url)
    )
  `);

  if (error) {
    console.error(error);
  }

  return (
    <div>
      <div>
        {bookmarks?.length === 0 ? (
          <p>No bookmarks yet</p>
        ) : (
          <div className={styles.bookmarksContainer}>
            {bookmarks?.map((bookmark: BookmarkType) => {
              return (
                <div
                  key={bookmark.shoot.name}
                  className={styles.bookmarkContainer}
                >
                  <div className={styles.bookmarkImageContainer}>
                    <Link
                      href={`/stylists/${bookmark.shoot.stylist.slug}/${bookmark.shoot.slug}`}
                    >
                      <Image
                        src={bookmark.shoot.shoot_images[0].image_url}
                        alt={bookmark.shoot.name}
                        fill
                      />
                    </Link>
                  </div>
                  <div className={styles.bookmarkDetailsContainer}>
                    <Link
                      href={`/stylists/${bookmark.shoot.stylist.slug}/${bookmark.shoot.slug}`}
                    >
                      <h2>
                        {bookmark.shoot.name}:
                        <span>{bookmark.shoot.stylist.name}</span>
                      </h2>
                    </Link>
                    <div className={styles.removeBookmarkButtonContainer}>
                      <RemoveBookmarkButton id={bookmark.id} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
