"use client";
import { FC, useRef } from "react";
import styles from "./GarmsList.module.css";
import { useFindWidestElement } from "../../../../../utils";
import { Insta } from "@/app/svgs";
import SaveGarmentButton from "./@ui/SaveGarmentButton";
import { ShootGarmentType } from "@/app/types";

type GarmsListProps = {
  garmsData: ShootGarmentType[];
};

const GarmsList: FC<GarmsListProps> = ({ garmsData }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widestElement = useFindWidestElement(containerRef, "data-measurewidth");

  if (!garmsData || garmsData.length === 0) {
    return null;
  }

  return (
    <div
      className={styles.container}
      data-testid="garms-list"
      ref={containerRef}
    >
      <ul>
        {garmsData?.map((garm: ShootGarmentType) => {
          if (
            !garm ||
            !garm.id ||
            !garm.name ||
            !garm.type ||
            !garm.brand?.name
          ) {
            return null;
          }
          return (
            <li
              key={garm.id}
              className={styles.garmItem}
              id={garm.id.toString()}
            >
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
              <div className={styles.garmLinks}>
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
                <SaveGarmentButton garmId={garm.id} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default GarmsList;
