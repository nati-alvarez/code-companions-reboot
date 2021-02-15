import styles from "@styles/LoadingAnimation.module.scss";

export default function LoadingAnimation(){
    return (
        <div data-testid="loading-animation" className={styles.container}>
            <div className={styles.circle}></div>
        </div>
    )
}