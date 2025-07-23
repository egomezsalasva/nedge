import styles from "./FeaturesForm.module.css";

type Details = {
  stylistName: string;
  shootName: string;
  city: string;
};

type SetDetails = (details: Details) => void;

type Props = {
  details: Details;
  setDetails: SetDetails;
};

const ShootDetailsForm = ({ details, setDetails }: Props) => {
  return (
    <div className={styles.sectionContainer}>
      <h2>Details</h2>
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="Stylist Name"
          value={details.stylistName}
          onChange={(e) =>
            setDetails({ ...details, stylistName: e.target.value })
          }
          required
          className={styles.formInput}
        />
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="Shoot Name"
          value={details.shootName}
          onChange={(e) =>
            setDetails({ ...details, shootName: e.target.value })
          }
          required
          className={styles.formInput}
        />
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="City"
          value={details.city}
          onChange={(e) => setDetails({ ...details, city: e.target.value })}
          required
          className={styles.formInput}
        />
      </div>
    </div>
  );
};

export default ShootDetailsForm;
