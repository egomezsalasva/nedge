"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Bookmark } from "@/app/svgs";
import LoginModal from "@/app/ui/modals/LoginModal";
import styles from "../ShootDetails.module.css";

const BookmarkButton = ({ shootId }: { shootId: number }) => {
  const [loading, setLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [modalActive, setModalActive] = useState(false);

  useEffect(() => {
    const checkAuthAndBookmark = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);

      if (user) {
        setLoading(true);
        const resBookmark = await fetch(
          `/api/account/bookmarks?shoot_id=${shootId}`,
        );
        const resultBookmark = await resBookmark.json();
        setIsBookmarked(resultBookmark.isBookmarked);
        setLoading(false);
      } else {
        setIsBookmarked(false);
      }
    };
    checkAuthAndBookmark();
  }, [shootId]);

  const handleBookmark = async () => {
    if (!isLoggedIn) {
      setModalActive(true);
      return;
    }
    setLoading(true);
    const res = await fetch("/api/account/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shoot_id: shootId }),
    });
    const result = await res.json();
    if (result.action === "inserted") setIsBookmarked(true);
    if (result.action === "deleted") setIsBookmarked(false);
    setLoading(false);
  };

  return (
    <>
      <button
        className={styles.bookmarkBtn}
        onClick={handleBookmark}
        data-testid="bookmark"
        disabled={isLoggedIn === null || loading}
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
