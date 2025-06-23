import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import LoginForm from "./LoginForm";
import styles from "./page.module.css";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/account/my-account");
  }

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <h1>NEDGE ACCOUNT</h1>
        <p>
          Sign up or log in to bookmark your favorite outfits and to save your
          favorite garments.
        </p>
        <LoginForm />
        <div className={styles.forgotPassword}>
          <Link href="/forgot-password">Forgot password?</Link>
        </div>
        <div className={styles.loginLink}>
          Don&apos;t have an account? <Link href="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
