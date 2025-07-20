import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LoginModal from "@/app/ui/modals/LoginModal";
import styles from "../GarmsList.module.css";

const SaveGarmentButton = ({ garmId }: { garmId: number }) => {
  const pathname = usePathname();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [modalActive, setModalActive] = useState(false);

  useEffect(() => {
    const checkAuthAndSaved = async () => {
      try {
        const response = await fetch(
          `/api/account/my-wardrobe?garment_id=${garmId}`,
        );

        if (response.status === 401) {
          setIsLoggedIn(false);
          setIsSaved(false);
        } else if (response.ok) {
          setIsLoggedIn(true);
          const data = await response.json();
          setIsSaved(data.isSaved);
        }
      } catch (error) {
        console.error("Error checking wardrobe status:", error);
        setIsLoggedIn(false);
        setIsSaved(false);
      }
    };
    checkAuthAndSaved();
  }, [garmId]);

  const toggleWardrobeItem = async () => {
    try {
      const response = await fetch("/api/account/my-wardrobe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          garment_id: garmId,
          source_pathname: pathname,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setIsSaved(data.action === "inserted");
      }
    } catch (error) {
      console.error("Error toggling wardrobe item:", error);
    }
  };

  const handleClick = () => {
    if (!isLoggedIn) {
      setModalActive(true);
    } else {
      toggleWardrobeItem();
    }
  };

  return (
    <>
      <button
        className={isSaved ? styles.garmSaveBtn_active : styles.garmSaveBtn}
        onClick={handleClick}
        disabled={isLoggedIn === null}
      >
        {isSaved ? "Saved" : "Save"}
      </button>
      {modalActive && (
        <LoginModal
          title="You Need To Login To Save"
          setIsActive={setModalActive}
        />
      )}
    </>
  );
};

export default SaveGarmentButton;
