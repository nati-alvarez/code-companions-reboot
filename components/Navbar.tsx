import Link from "next/link";
import jwt from "jsonwebtoken";

//styles
import styles from "@styles/Navbar.module.scss";

//atoms
import {useAtom} from "jotai";
import {JWTAuthTokenAtom} from "@atoms/auth";

export default function Navbar(){
    const [jwtToken, setJwtToken] = useAtom(JWTAuthTokenAtom);
    const user = jwt.decode(jwtToken);

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
                {!user &&
                    <Link href="/login-signup">
                        <a>Login/Signup</a>
                    </Link>
                }{user &&
                    <Link href="/profile">
                        <a>My Profile</a>
                    </Link>
                }
            </div>
        </nav>
    )
}