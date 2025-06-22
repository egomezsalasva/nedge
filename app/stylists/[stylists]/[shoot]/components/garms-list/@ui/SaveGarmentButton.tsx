import { createClient } from "@/utils/supabase/client";
import { usePathname } from "next/navigation";
import styles from "../GarmsList.module.css";
import { useEffect, useState } from "react";
import LoginModal from "@/app/ui/modals/LoginModal";

const SaveGarmentButton = ({ garmId }: { garmId: number }) => {
  const pathname = usePathname();
  const supabase = createClient();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [modalActive, setModalActive] = useState(false);

  useEffect(() => {
    const checkAuthAndSaved = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);

      if (user) {
        const { data } = await supabase
          .from("profile_garments")
          .select("*")
          .eq("garment_id", garmId);
        setIsSaved(!!(data && data.length > 0));
      } else {
        setIsSaved(false);
      }
    };
    checkAuthAndSaved();
  }, [garmId, supabase]);

  const getProfileId = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("auth_user_id", user.id)
      .single();
    if (profileError || !profile) return;
    return profile.id;
  };

  const addWardrobeItem = async () => {
    const profileId = await getProfileId();
    if (!profileId) return;

    const { error } = await supabase.from("profile_garments").insert([
      {
        profile_id: profileId,
        garment_id: garmId,
        source_pathname: pathname,
      },
    ]);
    if (!error) setIsSaved(true);
    if (error) console.error(error);
  };

  const removeWardrobeItem = async () => {
    const { error } = await supabase
      .from("profile_garments")
      .delete()
      .eq("garment_id", garmId);
    if (!error) setIsSaved(false);
  };

  if (!isLoggedIn) {
    return (
      <>
        <button
          className={styles.garmSaveBtn}
          onClick={() => setModalActive(true)}
          disabled={isLoggedIn === null}
        >
          Save
        </button>
        {modalActive && (
          <LoginModal
            title="You Need To Login To Save"
            setIsActive={setModalActive}
          />
        )}
      </>
    );
  }

  return (
    <>
      {isSaved ? (
        <button
          className={styles.garmSaveBtn_active}
          onClick={removeWardrobeItem}
        >
          Saved
        </button>
      ) : (
        <button className={styles.garmSaveBtn} onClick={addWardrobeItem}>
          Save
        </button>
      )}
    </>
  );
};

export default SaveGarmentButton;
