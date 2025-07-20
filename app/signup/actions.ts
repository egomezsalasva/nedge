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

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);
  if (error) {
    console.log(error);
    return { error: true };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .insert([{ email: data.email }]);
  if (profileError) {
    console.log(profileError);
    return { error: true };
  }
  //revalidatePath("/", "layout");
  return { success: true };
}
