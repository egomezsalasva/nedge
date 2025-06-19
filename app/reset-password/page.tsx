"use client";
import { useState } from "react";
import { redirect, useSearchParams } from "next/navigation";
import { ClosedIcon, EyeClosedIcon } from "../@ui/forms/@svgs";
import { createClient } from "@/utils/supabase/client";
import styles from "./page.module.css";
import formStyles from "@/app/@ui/forms/EmailPasswordForm.module.css";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const title = searchParams.get("title") || "Reset Password";

  const passwordsMatch = password === confirmPassword;

  const passwordMismatchError =
    (password || confirmPassword) && !passwordsMatch
      ? "Passwords do not match"
      : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) {
      return;
    }
    setServerError("");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setServerError(error.message);
    } else {
      redirect("/account");
    }
  };

  const displayError = serverError || passwordMismatchError;

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <h1>{title}</h1>
        <form onSubmit={handleSubmit} className={formStyles.form}>
          <div className={formStyles.inputContainer}>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${formStyles.formInput} ${formStyles.passwordInput}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className={formStyles.passwordButton}
            >
              {showPassword ? <ClosedIcon /> : <EyeClosedIcon />}
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`${formStyles.formInput} ${formStyles.passwordInput}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className={formStyles.passwordButton}
            >
              {showPassword ? <ClosedIcon /> : <EyeClosedIcon />}
            </button>
          </div>
          <button
            type="submit"
            disabled={
              !passwordsMatch || !!passwordMismatchError || password.length < 6
            }
            className={formStyles.submitButton}
          >
            Set New Password
          </button>
        </form>
        {displayError && <p style={{ color: "red" }}>{displayError}</p>}
      </div>
    </div>
  );
}
