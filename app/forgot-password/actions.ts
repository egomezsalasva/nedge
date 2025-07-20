"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function checkAuthAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/account/my-account");
  }
  return { isAuthenticated: false };
}

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address" };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { error: "An unexpected error occurred" };
  }
}
