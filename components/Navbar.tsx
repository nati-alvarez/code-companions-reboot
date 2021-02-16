import styles from "@styles/Navbar.module.scss";
import Link from "next/link";

export default function Navbar(){
    return (
        <nav className={styles.navbar}>
            <div className={styles["nav-section"]}>
                <Link href="/">
                    <a className={styles.logo}>Code_Companions</a>
                </Link>
                <Link href="/home">
                    <a>Home</a>
                </Link>
            </div>
            <div className={styles["nav-section"]}>
                <Link href="/social-hub">
                    <a>Social Hub</a>
                </Link>
                <Link href="/blog">
                    <a>Blog</a>
                </Link>
                <Link href="/login-signup">
                    <a>Login/Signup</a>
                </Link>
            </div>
        </nav>
    )
}