import { Suspense } from "react";
import ExploreContent from "./ExploreContent";
import styles from "./page.module.css";

function ExploreLoading() {
  return (
    <div>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Explore Styles</h1>
        </div>
      </main>
    </div>
  );
}

export default function Explore() {
  return (
    <Suspense fallback={<ExploreLoading />}>
      <ExploreContent />
    </Suspense>
  );
}
