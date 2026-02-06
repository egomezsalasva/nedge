import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import styles from "./layout.module.css";
import Header from "./(ui)/Header";

export default async function MyAccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/signup");
  }
  return (
    <div>
      <main className={styles.main}>
        <Header />
        <div className={styles.contentContainer}>{children}</div>
      </main>
    </div>
  );
}
