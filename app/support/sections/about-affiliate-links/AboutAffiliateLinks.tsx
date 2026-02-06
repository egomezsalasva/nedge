import ProfitBreakdownItem from "./@ui/ProfitBreakdownItem";
import styles from "../../page.module.css";

const AboutAffiliateLinks = () => {
  return (
    <section>
      <h2>About Affiliate Links</h2>
      <p>
        When you navigate to a shoot done by a stylist, you will see a list of
        the garments they carefully picked out for the shoot. Each garment will
        have an affiliate link to purchase that garment. If you purchase through
        this link you help both the stylist of that shoot as well as Nedge.
        <br />
        <br />
        Nedge will receive a the negotiated commission at no extra cost to you.
        This helps us keep the platform running and improve it for you. A
        percentage of that commission will be given to the stylist. As the
        foundation of Nedge gains strength, we want to be able to increase the
        percentage given to the stylist.
        <br />
        <br />
        If you decide to become a supporter, we will provide you a discount code
        for when you make a purchase.
      </p>
      <div className={styles.profitBreakdownContainer}>
        <ProfitBreakdownItem
          title="Stylist"
          percentage="33%"
          backgroundImgUrl="/imgs/support/team.jpeg"
        />
        <ProfitBreakdownItem
          title="Talent Scouting & Negotiations"
          percentage="33%"
          backgroundImgUrl="/imgs/support/negotiating.jpeg"
        />
        <ProfitBreakdownItem
          title="Platform Development & Hosting"
          percentage="33%"
          backgroundImgUrl="/imgs/support/hosting.jpeg"
        />
      </div>
    </section>
  );
};

export default AboutAffiliateLinks;
