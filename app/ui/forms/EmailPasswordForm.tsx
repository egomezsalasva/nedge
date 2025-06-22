import { useState } from "react";
import styles from "./EmailPasswordForm.module.css";
import { ClosedIcon, EyeClosedIcon } from "./@svgs";

type EmailPasswordFormProps = {
  submitHandler: (event: React.FormEvent<HTMLFormElement>) => void;
  submitText: string;
  isSubmitting: boolean;
  message: string;
};

const EmailPasswordForm = ({
  submitHandler,
  submitText,
  isSubmitting,
  message,
}: EmailPasswordFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length > 0;
  const isFormValid = isEmailValid && isPasswordValid;

  return (
    <form className={styles.form} onSubmit={submitHandler}>
      <div className={styles.inputContainer}>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.formInput}
        />
      </div>
      <div className={styles.inputContainer}>
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`${styles.formInput} ${styles.passwordInput}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className={styles.passwordButton}
        >
          {showPassword ? <ClosedIcon /> : <EyeClosedIcon />}
        </button>
      </div>
      <button
        type="submit"
        disabled={!isFormValid || isSubmitting}
        className={styles.submitButton}
      >
        {submitText}
      </button>
      {message && <div>{message}</div>}
    </form>
  );
};

export default EmailPasswordForm;
