import Navbar from "@components/Navbar";
import { useState } from "react";

//styles
import styles from "@styles/Home.module.scss";

export default function Home(){
    const [tab, setTab] = useState("projects");
    return (
        <div>
            <Navbar/>
            <main className={styles["main"]}>
            <div className={styles["dash-tabs"]}>
                <div onClick={()=> setTab("projects")} 
                className={tab == "projects"? `${styles['dash-tab']} ${styles['active']}` :styles["dash-tab"]}>
                    My Projects
                </div>
                <div onClick={()=> setTab("listings")}
                className={tab == "listings"? `${styles['dash-tab']} ${styles['active']}` :styles["dash-tab"]}>
                    Project Listings
                </div>
            </div>
            </main>
        </div>
    )
}