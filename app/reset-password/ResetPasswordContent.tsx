"use client";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { EyeOpenIcon, EyeClosedIcon } from "../ui/forms/@svgs";
import { resetPasswordAction } from "./actions";
import formStyles from "@/app/ui/forms/EmailPasswordForm.module.css";
import styles from "./page.module.css";
import Link from "next/link";

export default function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  const title = searchParams.get("title") || "Reset Password";

  const passwordsMatch = password === confirmPassword;
  const bothFieldsPopulated = password && confirmPassword;
  const bothFieldsTouched = passwordTouched && confirmPasswordTouched;
  const passwordMismatchError =
    bothFieldsPopulated && bothFieldsTouched && !passwordsMatch
      ? "Passwords do not match"
      : "";

  const isFormValid =
    passwordsMatch && password.length >= 6 && !passwordMismatchError;

  const handleSubmit = async (formData: FormData) => {
    setError("");
    startTransition(async () => {
      const result = await resetPasswordAction(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setPassword("");
        setConfirmPassword("");
        setPasswordTouched(false);
        setConfirmPasswordTouched(false);
        setError("");
        setSuccess(true);
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <h1>{title}</h1>
        <form action={handleSubmit} className={formStyles.form}>
          <div className={formStyles.inputContainer}>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setPasswordTouched(true)}
              className={`${formStyles.formInput} ${formStyles.passwordInput}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className={formStyles.passwordButton}
            >
              {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
            </button>
          </div>
          <div className={formStyles.inputContainer}>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm new password"
              autoComplete="new-password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => setConfirmPasswordTouched(true)}
              className={`${formStyles.formInput} ${formStyles.passwordInput}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className={formStyles.passwordButton}
            >
              {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
            </button>
          </div>
          <button
            type="submit"
            disabled={!isFormValid || isPending}
            className={formStyles.submitButton}
          >
            {isPending ? "Setting Password..." : "Set New Password"}
          </button>
        </form>
        {(error || passwordMismatchError) && (
          <p style={{ color: "red" }}>{error || passwordMismatchError}</p>
        )}
        {success && (
          <p>
            Password updated successfully!
            <br />
            <Link href="/account" style={{ textDecoration: "underline" }}>
              Go to account
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
