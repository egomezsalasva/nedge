"use client";
import { useState } from "react";
import styles from "@/app/ui/forms/EmailPasswordForm.module.css";
import { createClient } from "@/utils/supabase/client";

const ForgotPasswordForm = () => {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const submitPasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("A password reset link has been sent to your email.");
    }
    setIsSubmitting(true);
  };

  return (
    <form className={styles.form} onSubmit={submitPasswordReset}>
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
        disabled={!isEmailValid || isSubmitting}
        className={styles.submitButton}
      >
        Send reset link
      </button>
      {message && <div>{message}</div>}
    </form>
  );
};

export default ForgotPasswordForm;
