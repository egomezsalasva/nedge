"use client";
import styles from "../page.module.css";

export default function LogoutButton() {
  async function handleLogout() {
    await fetch("/auth/signout", { method: "POST" });
    window.location.href = "/login";
  }
  return (
    <button onClick={handleLogout} className={styles.logoutButton}>
      Log out
    </button>
  );
}
