import {useEffect, useRef} from "react";

//atoms
import {useAtom} from "jotai";
import {globalSuccessAtom} from '@atoms/globalMessages';

//styles
import styles from "@styles/GlobalMessages.module.scss";

export default function GlobalSuccess(){
    const [globalSuccess, setGlobalSuccess] = useAtom(globalSuccessAtom)
    const clearErrorTimeoutRef = useRef<any>();

    useEffect(()=>{
        if(globalSuccess){
            clearErrorTimeoutRef.current = setTimeout(() => {
                setGlobalSuccess("");
            }, 10000);
        }
        return ()=> clearTimeout(clearErrorTimeoutRef.current);
    }, [globalSuccess]);

    function clearErrorMessage(){
        setGlobalSuccess("");
        if(clearErrorTimeoutRef.current) clearTimeout(clearErrorTimeoutRef.current);    
    }

    if(globalSuccess){
        return (
            <div className={styles["success-container"]}>
                <button onClick={clearErrorMessage}>X</button>
                <p className={styles["success-message"]}>{globalSuccess}</p>
                <div className={styles["loading-bar"]}></div>
            </div>
        )
    }else return null;
}