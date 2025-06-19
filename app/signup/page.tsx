import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import SignupForm from "./SignupForm";
import styles from "./page.module.css";

export default async function SignupPage() {
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
        <SignupForm />
        <div className={styles.loginLink}>
          Already have an account? <Link href="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
}
