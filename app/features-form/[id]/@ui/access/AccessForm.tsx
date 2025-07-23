import { useEffect, useState } from "react";
import styles from "./AccessForm.module.css";

const AccessForm = ({
  submissionCode,
  setAccess,
}: {
  submissionCode: string;
  setAccess: (access: boolean) => void;
}) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (code.toLowerCase() === submissionCode.toLowerCase()) {
      setAccess(true);
    } else {
      setError("Invalid access code");
    }
  };

  useEffect(() => {
    setIsFormValid(code.toLowerCase() === submissionCode.toLowerCase());
  }, [code, submissionCode]);

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.innerContainer}>
        <h2 className={styles.title}>Enter Access Code</h2>
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Access code"
            className={styles.formInput}
          />
        </div>

        <button
          type="submit"
          disabled={!isFormValid}
          className={styles.submitButton}
        >
          Access
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: 16 }}>{error}</p>}
    </div>
  );
};

export default AccessForm;
