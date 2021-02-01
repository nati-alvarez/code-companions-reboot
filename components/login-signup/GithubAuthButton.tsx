//styles
import styles from "@styles/LoginSignup.module.scss";

//icons
import {FaGithubAlt} from "react-icons/fa";

interface PropTypes {
    buttonText: string,
    redirectState: string
}

export default function GithubAuthButton({buttonText, redirectState}: PropTypes) {
    return (
        <a href={`https://github.com/login/oauth/authorize?client_id=3aca74311ea624aeb9ac&scope=repo&state=${redirectState}`}>
            <button className={styles["secondary-button-wide"]}>
                <span>{buttonText}</span>
                <FaGithubAlt/>
            </button>
        </a>
    )
}