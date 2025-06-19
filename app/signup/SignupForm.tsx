"use client";
import { useState } from "react";
import { signup } from "./actions";
import EmailPasswordForm from "../@ui/forms/EmailPasswordForm";

export default function SignupForm() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const result = await signup(formData);
    if (result?.success) {
      setMessage(
        "Signup successful! Please check your email to confirm your account.",
      );
    } else {
      setMessage("Signup failed. Please try again.");
    }
    setIsSubmitting(false);
  }

  return (
    <EmailPasswordForm
      submitHandler={handleSignup}
      submitText="Sign up"
      isSubmitting={isSubmitting}
      message={message}
    />
  );
}
