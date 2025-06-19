import Link from "next/link";
import LogoutButton from "./@ui/LogoutButton";
import { createClient } from "@/utils/supabase/server";
import styles from "./page.module.css";

const MyAccountPage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const email = user?.email || "Loading...";

  return (
    <main className={styles.main}>
      <div className={styles.emailContainer}>
        <h2>Email</h2>
        <p>{email}</p>
      </div>
      <div className={styles.passwordContainer}>
        <h2>Password</h2>
        <Link href="/reset-password?title=Change%20password">
          Change password
        </Link>
      </div>
      <div className={styles.subscriptionContainer}>
        <h2>Subscription</h2>
        <Link href="/support">Support Nedge</Link>
      </div>
      <LogoutButton />
    </main>
  );
};

export default MyAccountPage;
