"use client";
import { FC, useRef } from "react";
import { ShootType } from "@/app/@data";
import styles from "./GarmsList.module.css";
import { useFindWidestElement } from "../../../../../@utils";
type GarmsListProps = {
  garmsData: ShootType["items"];
};

const GarmsList: FC<GarmsListProps> = ({ garmsData }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widestElement = useFindWidestElement(containerRef, "data-measurewidth");
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
                >
                  Insta
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
              <button className={styles.garmSaveBtn}>Save</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GarmsList;
