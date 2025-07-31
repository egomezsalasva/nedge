"use client";
import { useState, useTransition } from "react";
import { forgotPasswordAction } from "./actions";
import styles from "@/app/ui/forms/EmailPasswordForm.module.css";

const ForgotPasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (formData: FormData) => {
    setMessage("");
    startTransition(async () => {
      try {
        const result = await forgotPasswordAction(formData);
        if (result?.error) {
          setMessage(result.error);
        } else {
          setMessage("A password reset link has been sent to your email.");
          setEmail("");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
        setMessage(errorMessage);
      }
    });
  };

  return (
    <form className={styles.form} action={handleSubmit}>
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
      <button
        type="submit"
        disabled={!isEmailValid || isPending}
        className={styles.submitButton}
      >
        {isPending ? "Sending..." : "Send reset link"}
      </button>
      {message && <div>{message}</div>}
    </form>
  );
};

export default ForgotPasswordForm;
