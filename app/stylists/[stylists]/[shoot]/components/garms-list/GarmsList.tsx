"use client";
import { FC, useEffect, useRef, useState } from "react";
import { ShootType } from "@/app/@data";
import styles from "./GarmsList.module.css";
import { useFindWidestElement } from "../../../../../@utils";
import { useUserContext, WardrobeItem } from "@/app/@contexts/UserContext";
import { Insta } from "@/app/@svgs";
import { usePathname } from "next/navigation";

type GarmsListProps = {
  garmsData: ShootType["items"];
};

type GarmsListItem = WardrobeItem & {
  instagramLink?: string;
  affiliateLink?: string;
};

const GarmsList: FC<GarmsListProps> = ({ garmsData }) => {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const widestElement = useFindWidestElement(containerRef, "data-measurewidth");
  const { wardrobe, addWardrobeItem, removeWardrobeItem } = useUserContext();
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const isSaved = (garm: GarmsListItem) => {
    if (!isClient) return false;
    return wardrobe.some(
      (item) =>
        `${item.sourceShootLink}#${item.id}` ===
        `${item.sourceShootLink}#${garm.id}`,
    );
  };

  return (
    <div
      className={styles.container}
      data-testid="garms-list"
      ref={containerRef}
    >
      <ul>
        {garmsData?.map((garm) => (
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
                <div className={styles.garmBrand}>{garm.brand}</div>
              </div>
            </div>
            <div>
              {garm.instagramLink && !garm.affiliateLink && (
                <a
                  href={garm.instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.garmLink}
                  data-testid="insta-link"
                >
                  <Insta className={styles.garmLinkIcon} />
                </a>
              )}
              {garm.affiliateLink && (
                <a
                  href={garm.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.garmLink}
                >
                  Buy
                </a>
              )}
              {isClient && (
                <>
                  {isSaved(garm) ? (
                    <button
                      className={styles.garmSaveBtn}
                      onClick={() => removeWardrobeItem(garm.id)}
                    >
                      Saved
                    </button>
                  ) : (
                    <button
                      className={styles.garmSaveBtn}
                      onClick={() =>
                        addWardrobeItem({
                          ...garm,
                          sourceShootLink: pathname,
                        })
                      }
                    >
                      Save
                    </button>
                  )}
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GarmsList;
