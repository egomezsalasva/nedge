import Link from "next/link";
import LogoArca from "./@svgs/LogoArca";
import HeaderMobile from "./HeaderMobile";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.container}>
      <div className={styles.innerContainer}>
        <Link href="/" className={styles.logoContainer} data-testid="logo">
          <LogoArca />
        </Link>
        <div className={styles.nav_desktop}>
          <div className={styles.navLeft}>
            <nav className={styles.navContainer} data-testid="nav">
              <ul>
                <li>
                  <Link href="/">LATEST</Link>
                </li>
                <li>
                  <Link href="/explore">STYLES</Link>
                </li>
                <li>
                  <Link href="/brands">BRANDS</Link>
                </li>
                {/* <li>
                  <Link href="/events">EVENTS</Link>
                </li> */}
                <li className={styles.supportBtn}>
                  <Link href="/support">SUPPORT</Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className={styles.headerRight}>
            <Link href="/account">MY ACCOUNT</Link>
          </div>
        </div>
        <div className={styles.nav_mobile}>
          <HeaderMobile />
        </div>
      </div>
    </header>
  );
};

export default Header;
