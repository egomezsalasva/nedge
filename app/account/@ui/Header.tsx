"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "../layout.module.css";
import { Arrow } from "@/app/@svgs";

const Header = () => {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href ? styles.navLink_active : styles.navLink;
  return (
    <div className={styles.header}>
      <div className={styles.heading}>
        <h1>My Account</h1>
        {pathname === "/account/my-account" ? (
          <Link href="/account/bookmarks" className={styles.accountLink}>
            MY NEDGE <Arrow className={styles.arrowAccount_back} />
          </Link>
        ) : (
          <Link href="/account/my-account" className={styles.accountLink}>
            ACCOUNT <Arrow className={styles.arrowAccount} />
          </Link>
        )}
      </div>
      {pathname !== "/account/my-account" && (
        <nav>
          <Link
            href="/account/bookmarks"
            className={isActive("/account/bookmarks")}
          >
            Bookmarks
          </Link>
          <Link
            href="/account/my-wardrobe"
            className={isActive("/account/my-wardrobe")}
          >
            My Wardrobe
          </Link>
        </nav>
      )}
    </div>
  );
};

export default Header;
