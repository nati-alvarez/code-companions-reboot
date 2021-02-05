import styles from "@styles/LoadingAnimation.module.scss";

export default function LoadingAnimation(){
    return (
        <div className={styles.container}>
            <div className={styles.circle}></div>
        </div>
    )
}