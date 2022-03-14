import Link from "next/link";

import styles from "@styles/workspace/main.module.scss";

export default function Project(){
    return (
        <div className={styles["workspace-container"]}>
            <Link href="/home">
                <button className={styles["return-home-btn"]}>Back To Home</button>
            </Link>
            <nav>
                <a>
                    Project Info
                </a>
                <a>
                    Chat
                </a>
                <a>
                    Tasks
                </a>
                <a>
                    Github
                </a>
            </nav>
        </div>
    )
}