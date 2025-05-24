import { BrandList } from "./components";
import styles from "./page.module.css";

export default function BrandsPage() {
  return (
    <div>
      <main className={styles.main}>
        <h1>Brands</h1>
        <BrandList />
      </main>
    </div>
  );
}
