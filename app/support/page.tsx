import {
  HeroSection,
  AboutSupportersSection,
  AboutAffiliateLinksSection,
} from "./sections";
import styles from "./page.module.css";

export default function SupportPage() {
  return (
    <div>
      <main className={styles.main}>
        <HeroSection />
        <AboutSupportersSection />
        <AboutAffiliateLinksSection />
      </main>
    </div>
  );
}
