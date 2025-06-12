import { LatestShoot, LatestList } from "./latest";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div>
      <main className={styles.main}>
        <LatestShoot />
        <LatestList />
      </main>
    </div>
  );
}
