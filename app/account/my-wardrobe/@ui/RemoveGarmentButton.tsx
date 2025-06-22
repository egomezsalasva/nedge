"use client";
import { Bin } from "@/app/svgs";
import styles from "../page.module.css";
import { createClient } from "@/utils/supabase/client";

const RemoveGarmentButton = ({ garmentId }: { garmentId: number }) => {
  const supabase = createClient();

  const removeWardrobeItem = async (id: number) => {
    const { error } = await supabase
      .from("profile_garments")
      .delete()
      .eq("garment_id", id);
    if (error) {
      console.error(error);
    }
    window.location.reload();
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
