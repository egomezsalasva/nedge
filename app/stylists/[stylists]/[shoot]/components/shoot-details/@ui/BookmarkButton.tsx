"use client";
import { useEffect, useState } from "react";
import { Bookmark } from "@/app/svgs";
import LoginModal from "@/app/ui/modals/LoginModal";
import styles from "../ShootDetails.module.css";

const BookmarkButton = ({ shootId }: { shootId: number }) => {
  const [loading, setLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean | null>(null);
  const [modalActive, setModalActive] = useState(false);

  useEffect(() => {
    const checkAuthAndBookmark = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/account/bookmarks?shoot_id=${shootId}&source_pathname=${encodeURIComponent(window.location.pathname)}`,
        );
        if (res.ok) {
          const result = await res.json();
          setIsBookmarked(result.isBookmarked);
        } else if (res.status === 401) {
          setIsBookmarked(false);
        }
      } catch (error) {
        console.error("Error checking bookmark status:", error);
        setIsBookmarked(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuthAndBookmark();
  }, [shootId]);

  const handleBookmark = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/account/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shoot_id: shootId,
          source_pathname: window.location.pathname,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.action === "inserted") setIsBookmarked(true);
        if (result.action === "deleted") setIsBookmarked(false);
      } else if (res.status === 401) {
        setModalActive(true);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className={styles.bookmarkBtn}
        onClick={handleBookmark}
        data-testid="bookmark"
        disabled={loading}
      >
        <Bookmark fill={isBookmarked ? "currentColor" : "none"} />
      </button>
      {modalActive && (
        <LoginModal
          title="You Need To Login To Bookmark"
          setIsActive={setModalActive}
        />
      )}
    </>
  );
};

export default BookmarkButton;
