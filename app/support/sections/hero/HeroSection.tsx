import styles from "../../page.module.css";

const HeroSection = () => {
  return (
    <section className={styles.heroContainer}>
      <div className={styles.heroCard}>
        <h1>Support Nedge</h1>
        <p className={styles.heroCardSubtitle}>Help Nedge Stay Alive</p>
        <ul>
          <li>Save garments from the shoots to your wardrobe</li>
          <li>Unlimited shoot bookmarks</li>
          <li>Get a discount code on buy links</li>
          <li>Become a Supporter Stylist</li>
        </ul>
        <p className={styles.heroCardPrice}>
          <span>From</span>
          <span className={styles.heroCardPriceAmount}>€ 2.95</span>
          <span>/ month</span>
        </p>
        <div className={styles.heroCardButtonContainer}>
          <button>Become a Supporter</button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
