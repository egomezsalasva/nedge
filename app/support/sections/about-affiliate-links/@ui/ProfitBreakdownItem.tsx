import styles from "../../../page.module.css";

type ProfitBreakdownItemProps = {
  title: string;
  percentage: string;
  backgroundImgUrl?: string;
};

const ProfitBreakdownItem = ({
  title,
  percentage,
  backgroundImgUrl,
}: ProfitBreakdownItemProps) => {
  return (
    <div
      className={styles.profitBreakdownItem}
      style={
        {
          width: percentage,
          "--before-background-img": `url(${backgroundImgUrl})`,
        } as React.CSSProperties
      }
      data-testid="profit-breakdown-item"
    >
      <div className={styles.profitBreakdownItemTitle}>{title}</div>
      <div className={styles.profitBreakdownItemPercentage}>{percentage}</div>
    </div>
  );
};

export default ProfitBreakdownItem;
