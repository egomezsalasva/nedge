import { LatestShoot, LatestList } from "./latest";
import { shoots } from "./@data";
import styles from "./page.module.css";

export default function Home() {
  const latestShoot = shoots[0];
  return (
    <div>
      <main className={styles.main}>
        <LatestShoot latestShootData={latestShoot} />
        <LatestList />
      </main>
    </div>
  );
}
