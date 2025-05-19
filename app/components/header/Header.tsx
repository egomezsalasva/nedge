import Link from "next/link";
import Logo from "./@svgs/Logo";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.container}>
      <div className={styles.headerLeft}>
        <div className={styles.logoContainer} data-testid="logo">
          <Logo />
        </div>
        <nav className={styles.navContainer} data-testid="nav">
          <ul>
            <li>
              <Link href="/">LATEST</Link>
            </li>
            <li>
              <Link href="/styles">STYLES</Link>
            </li>
            <li>
              <Link href="/brands">BRANDS</Link>
            </li>
            <li>
              <Link href="/events">EVENTS</Link>
            </li>
            <li className={styles.supportBtn}>
              <Link href="/support-styleista">SUPPORT</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className={styles.headerRight}>
        <Link href="/my-account">MY ACCOUNT</Link>
      </div>
    </header>
  );
};

export default Header;
