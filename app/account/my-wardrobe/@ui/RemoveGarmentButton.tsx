"use client";
import { Bin } from "@/app/svgs";
import styles from "../page.module.css";

const RemoveGarmentButton = ({ garmentId }: { garmentId: number }) => {
  const removeWardrobeItem = async (id: number) => {
    try {
      const res = await fetch(`/api/account/my-wardrobe`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ garmentId: id }),
      });
      if (!res.ok) {
        const error = await res.json();
        console.error(error);
      }
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button
      className={styles.removeBtn}
      onClick={() => removeWardrobeItem(garmentId)}
    >
      <Bin />
    </button>
  );
};

export default RemoveGarmentButton;
