import styles from "./page.module.css";
import { StyleCategoriesList } from "./components";

export default function Styles() {
  return (
    <div>
      <main className={styles.main}>
        <h1>Explore Styles</h1>
        <StyleCategoriesList />
      </main>
    </div>
  );
}
