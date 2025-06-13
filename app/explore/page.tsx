"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { StyleCategoriesList, StyleShootsList } from "./components";
import { Arrow } from "../@svgs";
import styles from "./page.module.css";

export default function Explore() {
  const searchParams = useSearchParams();
  const selectedSubstyle = searchParams.get("substyle");
  const router = useRouter();
  return (
    <div>
      <main className={styles.main}>
        <div className={styles.header}>
          {selectedSubstyle && (
            <button onClick={() => router.back()} className={styles.backButton}>
              <Arrow />
            </button>
          )}
          <h1>
            Explore Styles
            {selectedSubstyle && <span>[{selectedSubstyle}]</span>}
          </h1>
        </div>
        {selectedSubstyle ? (
          <StyleShootsList subStyle={selectedSubstyle} />
        ) : (
          <StyleCategoriesList />
        )}
      </main>
    </div>
  );
}
