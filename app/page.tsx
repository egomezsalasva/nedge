import { LatestShoot, LatestList } from "./components/latest";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <LatestShoot />
        <LatestList />
      </main>
    </div>
  );
}
