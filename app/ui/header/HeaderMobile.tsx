"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./HeaderMobile.module.css";

const HeaderMobile = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 200);
  };

  return (
    <div className={styles.headerMobileContainer}>
      <div
        className={styles.hamburgerContainer}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <div className={styles.hamburgerTopLine} />
        <div className={styles.hamburgerMiddleLine} />
        <div className={styles.hamburgerBottomLine} />
      </div>
      <div
        className={
          isMobileMenuOpen ? styles.navContainer : styles.navContainer_closed
        }
      >
        <nav>
          <ul>
            <li>
              <Link href="/" onClick={closeMobileMenu}>
                LATEST
              </Link>
            </li>
            <li>
              <Link href="/explore" onClick={closeMobileMenu}>
                STYLES
              </Link>
            </li>
            <li>
              <Link href="/brands" onClick={closeMobileMenu}>
                BRANDS
              </Link>
            </li>
            {/* <li>
                  <Link href="/events">EVENTS</Link>
                </li> */}
            <li className={styles.supportBtn}>
              <Link href="/support" onClick={closeMobileMenu}>
                SUPPORT
              </Link>
            </li>
          </ul>
        </nav>
        <div className={styles.accountContainer}>
          <Link href="/account" onClick={closeMobileMenu}>
            MY ACCOUNT
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeaderMobile;
