"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function resetPasswordAction(formData: FormData) {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  if (!password || !confirmPassword) {
    return { error: "Both password fields are required" };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long" };
  }
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      return { error: error.message };
    }
    revalidatePath("/account");
    return { success: true };
  } catch (error) {
    return { error: "An unexpected error occurred" };
  }
}
