"use client";
import { FC, useState } from "react";
import { StyleCategoryType, stylesData } from "./@data";
import styles from "./StyleCategoriesList.module.css";
import { Arrow } from "@/app/@svgs";

const StyleCategoriesList: FC = () => {
  const [expanded, setExpanded] = useState<string[]>([]);

  const handleToggle = (categoryName: string) => {
    setExpanded((expandedCategories) => {
      const isAlreadyExpanded = expandedCategories.includes(categoryName);
      if (isAlreadyExpanded) {
        return expandedCategories.filter(
          (expandedCategory) => expandedCategory !== categoryName,
        );
      } else {
        return [...expandedCategories, categoryName];
      }
    });
  };

  return (
    <section>
      <ul className={styles.stylesList}>
        {stylesData.map((style: StyleCategoryType) => (
          <li key={style.name}>
            <div className={styles.styleTitle}>
              <label>{style.name}</label>
              <button
                onClick={() => handleToggle(style.name)}
                data-testid={`style-toggle-${style.name}`}
              >
                {expanded.includes(style.name) ? (
                  <Arrow className={styles.arrowClosed} />
                ) : (
                  <Arrow className={styles.arrowOpen} />
                )}
              </button>
            </div>
            {expanded.includes(style.name) && (
              <ul className={styles.subStylesList}>
                {style.subStyles.map((subStyle: string) => (
                  <li key={subStyle}>
                    <div className={styles.subStyle}>
                      <label>{subStyle}</label>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default StyleCategoriesList;
