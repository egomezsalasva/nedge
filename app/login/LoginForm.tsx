"use client";
import { useState } from "react";
import { login } from "./actions";
import EmailPasswordForm from "../@ui/forms/EmailPasswordForm";

export default function SignupForm() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const result = await login(formData);
    if (result?.error) {
      console.log(result);
      setMessage("The email or password is incorrect.");
    }
    setIsSubmitting(false);
  }

  return (
    <EmailPasswordForm
      submitHandler={handleLogin}
      submitText="Log in"
      isSubmitting={isSubmitting}
      message={message}
    />
  );
}
