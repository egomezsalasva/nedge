"use client";
import { FC, useRef } from "react";
import styles from "./GarmsList.module.css";
import { useFindWidestElement } from "../../../../../@utils";
import { useUserContext } from "@/app/@contexts/UserContext";
import { Insta } from "@/app/@svgs";

type GarmsListItem = {
  id: number;
  name: string;
  type: string;
  brand: {
    name: string;
    instagram_url?: string;
  };
  affiliate_link?: string;
};

type GarmsListProps = {
  garmsData: GarmsListItem[];
};

const GarmsList: FC<GarmsListProps> = ({ garmsData }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widestElement = useFindWidestElement(containerRef, "data-measurewidth");
  const {
    wardrobe,
    // addWardrobeItem, removeWardrobeItem
  } = useUserContext();
  // const [isClient, setIsClient] = useState(false);
  // useEffect(() => {
  //   setIsClient(true);
  // }, []);

  // const isSaved = (garm: any) => {
  //   if (!isClient) return false;
  //   return wardrobe.some(
  //     (item) =>
  //       `${item.sourceShootLink}#${item.id}` ===
  //       `${item.sourceShootLink}#${garm.id}`,
  //   );
  // };

  return (
    <div
      className={styles.container}
      data-testid="garms-list"
      ref={containerRef}
    >
      <ul>
        {garmsData?.map((garm: GarmsListItem) => (
          <li key={garm.id} className={styles.garmItem} id={garm.id.toString()}>
            <div className={styles.garmInfo}>
              <div
                className={styles.garmType}
                data-measurewidth
                style={{ width: widestElement ? widestElement : "auto" }}
              >
                {garm.type}
              </div>
              <div className={styles.garmNameBrand}>
                <div className={styles.garmName}>{garm.name}</div>
                <div className={styles.garmBrand}>{garm.brand.name}</div>
              </div>
            </div>
            <div>
              {garm.brand.instagram_url && !garm.affiliate_link && (
                <a
                  href={garm.brand.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.garmLink}
                  data-testid="insta-link"
                >
                  <Insta className={styles.garmLinkIcon} />
                </a>
              )}
              {garm.affiliate_link && (
                <a
                  href={garm.affiliate_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.garmLink}
                >
                  Buy
                </a>
              )}
              <button className={styles.garmSaveBtn}>Save</button>
              {/* {isClient && (
                <>
                  {isSaved(garm) ? (
                    <button
                      className={styles.garmSaveBtn_active}
                      // onClick={() => removeWardrobeItem(garm.id)}
                    >
                      Saved
                    </button>
                  ) : (
                    <button
                      className={styles.garmSaveBtn}
                      // onClick={() =>
                      //   addWardrobeItem({
                      //     ...garm,
                      //     sourceShootLink: pathname,
                      //   })
                      // }
                    >
                      Save
                    </button>
                  )}
                </>
              )} */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GarmsList;
