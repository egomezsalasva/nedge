import styles from "./page.module.css";

const SubmittedPage = () => {
  return (
    <div className={styles.container} style={{ textAlign: "center" }}>
      <h1 style={{ textTransform: "uppercase" }}>
        Your Submission has been Sent!
      </h1>
      <p>
        Thank you for submitting your feature request. We will review it and get
        back to you as soon as possible. We will provide a preview so you can
        review if everything is correct.
      </p>
      <p>
        If you wish to resubmit please contanct the member of Nedge who you have
        been in contact with or email us at: <br />
        <span
          style={{
            display: "block",
            fontWeight: "bold",
            textTransform: "uppercase",
            marginTop: "1rem",
          }}
        >
          shoots@nedgestyle.com
        </span>
      </p>
    </div>
  );
};

export default SubmittedPage;
