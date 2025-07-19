import { useState } from "react";
import { EyeClosedIcon, EyeOpenIcon } from "./@svgs";
import styles from "./EmailPasswordForm.module.css";

type EmailPasswordFormProps = {
  submitHandler: (event: React.FormEvent<HTMLFormElement>) => void;
  submitText: string;
  isSubmitting: boolean;
  message: string;
  passwordAutoComplete?: "current-password" | "new-password";
};

const EmailPasswordForm = ({
  submitHandler,
  submitText,
  isSubmitting,
  message,
  passwordAutoComplete = "current-password",
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
          autoComplete={passwordAutoComplete}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`${styles.formInput} ${styles.passwordInput}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className={styles.passwordButton}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOpenIcon testId="eye-open-icon" />
          ) : (
            <EyeClosedIcon testId="eye-closed-icon" />
          )}
        </button>
      </div>
      <button
        type="submit"
        disabled={!isFormValid || isSubmitting}
        className={styles.submitButton}
      >
        {submitText}
      </button>
      {message && <div data-testid="form-message">{message}</div>}
    </form>
  );
};

export default EmailPasswordForm;
