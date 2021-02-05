import {useEffect, useRef} from "react";

//atoms
import {useAtom} from "jotai";
import {globalErrorAtom} from '@atoms/globalMessages';

//styles
import styles from "@styles/GlobalMessages.module.scss";

export default function GlobalError(){
    const [globalError, setGlobalError] = useAtom(globalErrorAtom)
    const clearErrorTimeoutRef = useRef<any>();

    useEffect(()=>{
        if(globalError){
            clearErrorTimeoutRef.current = setTimeout(() => {
                setGlobalError("");
            }, 10000);
        }
        return ()=> clearTimeout(clearErrorTimeoutRef.current);
    }, [globalError]);

    function clearErrorMessage(){
        setGlobalError("");
        if(clearErrorTimeoutRef.current) clearTimeout(clearErrorTimeoutRef.current);    
    }

    if(globalError){
        return (
            <div className={styles["error-container"]}>
                <button onClick={clearErrorMessage}>X</button>
                <p className={styles["error-message"]}>{globalError}</p>
                <div className={styles["loading-bar"]}></div>
            </div>
        )
    }else return null;
}