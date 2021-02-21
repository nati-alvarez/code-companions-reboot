//styles
import styles from "@styles/Modal.module.scss";
import { ChangeEvent, FormEvent, useState } from "react";

//types
interface PropTypes {
    heading: string,
    modalAction: FormEvent,
    modalState: any,
    modalError: any,
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    isLoading: boolean,
    setIsLoading: Function,
    setShowModal: Function
}

//icons
import {ImEye, ImEyeBlocked} from "react-icons/im";

export default function CreateProjectModal({heading, modalState, modalError, modalAction, onChange, setShowModal, isLoading, setIsLoading} : PropTypes){
    const [showPassword, setShowPassword] = useState(false);

    const inputs = [];
    for(let prop in modalState){
        let field = modalState[prop];
        let input;
        switch(field.inputType){
            case "email":
            case "text":
                input = 
                    <fieldset key={field.label}>
                        <label htmlFor={field.label}>{field.label}</label>
                        <input 
                            className={modalError.inputId===field.label? styles["input-error"]: ""} 
                            onChange={onChange} 
                            type={field.inputType} 
                            name={field.label} 
                            id={field.label} 
                            value={field.value}
                        />
                    </fieldset>
                break;
            case "textarea":
                input = 
                    <fieldset key={field.label}>
                        <label htmlFor={field.label}>{field.label}</label>
                        <textarea 
                            className={modalError.inputId===field.label? styles["input-error"]: ""} 
                            rows={5}
                            onChange={onChange} 
                            name={field.label} 
                            id={field.label} 
                            value={field.value}>
                        </textarea>
                    </fieldset>
                break;
            case "password":
                input = (
                    <fieldset key={field.label.toString()}>
                        <label htmlFor={field.label.toString()}>{field.label}</label>
                        <div className={styles["password-input"]}>
                            <input 
                                className={modalError.inputId===field.label? styles["input-error"]: ""} 
                                onChange={onChange} 
                                type={showPassword? "text": "password"} 
                                name={field.name} 
                                id={field.label.toString()} 
                                value={field.value}
                            />
                            <div onClick={()=> setShowPassword(!showPassword)}>
                                {showPassword? <ImEye size={24}/>: <ImEyeBlocked size={24}/>}
                            </div>
                        </div>
                    </fieldset>
                )
                break;
        }
        inputs.push(input);
    }

    return (
       <div className={styles["modal-background"]}>
            <form onSubmit={modalAction as any}>
                <h3>{heading}</h3>
                {inputs}
                <div className={styles['actions']}>
                    <button className={styles['modal-button']}>Create Project</button>
                    <button onClick={()=> setShowModal(false)}>Close</button>
                </div>
                {modalError.message && 
                    <p className={styles["modal-error"]}>{modalError.message}</p>
                }
            </form>
       </div>
   ) 
}