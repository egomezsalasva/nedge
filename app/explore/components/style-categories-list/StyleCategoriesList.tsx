"use client";
import { FC, useEffect, useState } from "react";
import styles from "./StyleCategoriesList.module.css";
import { Arrow } from "@/app/@svgs";
import Link from "next/link";

export type StyleCategoryType = {
  name: string;
  subStyles: { name: string; slug: string }[];
};

const StyleCategoriesList: FC = () => {
  const [expanded, setExpanded] = useState<string[]>([]);
  const [categories, setCategories] = useState<StyleCategoryType[]>([]);

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/explore/style-categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching style tags:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section>
      <ul className={styles.stylesList}>
        {categories.map((style: StyleCategoryType) => (
          <li key={style.name}>
            <div className={styles.styleTitle}>
              <label>{style.name}</label>
              <button
                onClick={() => handleToggle(style.name)}
                data-testid={`style-toggle-${style.name}`}
              >
                {expanded.includes(style.name) ? (
                  <Arrow className={styles.arrowOpen} dataTestId="arrow-open" />
                ) : (
                  <Arrow
                    className={styles.arrowClosed}
                    dataTestId="arrow-closed"
                  />
                )}
              </button>
            </div>
            {expanded.includes(style.name) && (
              <ul className={styles.subStylesList}>
                {style.subStyles.map(
                  (subStyle: { name: string; slug: string }) => (
                    <li key={subStyle.slug}>
                      <Link
                        href={`?substyle=${subStyle.slug}`}
                        className={styles.subStyle}
                        scroll={false}
                      >
                        <label>{subStyle.name}</label>
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default StyleCategoriesList;
