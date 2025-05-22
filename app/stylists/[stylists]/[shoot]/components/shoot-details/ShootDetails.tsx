import { FC } from "react";
import { ShootType } from "@/app/@data";
import styles from "./ShootDetails.module.css";

type ShootDetailsProps = {
  shootData: ShootType;
};

const ShootDetails: FC<ShootDetailsProps> = ({ shootData }) => {
  const { details, team } = shootData;
  return (
    <div className={styles.container} data-testid="shoot-details">
      <div className={styles.headerContainer}>
        <div className={styles.headerInfo}>
          <span>{details.date}</span>
          <span>{details.city}</span>
        </div>
        <button className={styles.bookmarkBtn} data-testid="bookmark" />
      </div>
      <div className={styles.stylistContainer}>
        <div className={styles.stylistHeader}>
          <h2>{details.stylist}</h2>
          <button>Follow</button>
        </div>
        <div>
          <p>{details.stylistDescription}</p>
        </div>
      </div>
      <div className={styles.shootContainer}>
        <h2>{details.title}</h2>
        <ul>
          {details.tags.map((tag) => (
            <li key={tag} className={`tag`}>
              {tag}
            </li>
          ))}
        </ul>
        <p>{details.description}</p>
      </div>
      <div className={styles.teamContainer}>
        <ul>
          {team?.map((member) => (
            <li key={member.name}>
              <span className={styles.teamMemberRole}>{member.role}</span>:{" "}
              <span className={styles.teamMemberName}>{member.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ShootDetails;
