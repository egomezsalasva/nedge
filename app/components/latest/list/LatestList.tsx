import styles from "./LatestList.module.css";
import { shoots } from "../../../@data";
import Card from "./@ui/card/Card";

const LatestList = () => {
  return (
    <div className={styles.container}>
      <h2>Latest Shoots</h2>
      <div className={styles.cardsContainer}>
        {shoots.slice(1).map((shoot, index) => (
          <Card key={index} shoot={shoot} />
        ))}
      </div>
    </div>
  );
};

export default LatestList;
