"use client";
import Link from "next/link";
import styles from "./layout.module.css";
import { usePathname } from "next/navigation";
import { Arrow } from "../@svgs";

export default function MyAccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href ? styles.navLink_active : styles.navLink;
  return (
    <div>
      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.heading}>
            <h1>My Account</h1>
            <div className={styles.accountLink}>
              ACCOUNT <Arrow className={styles.arrowAccount} />
            </div>
          </div>
          <nav>
            <Link
              href="/account/bookmarks"
              className={isActive("/account/bookmarks")}
            >
              Bookmarks
            </Link>
            <Link
              href="/account/following"
              className={isActive("/account/following")}
            >
              Following
            </Link>
            <Link
              href="/account/my-wardrobe"
              className={isActive("/account/my-wardrobe")}
            >
              My Wardrobe
            </Link>
          </nav>
        </div>
        <div className={styles.contentContainer}>{children}</div>
      </main>
    </div>
  );
}
