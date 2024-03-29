//styles
import styles from "@styles/Modal.module.scss";
import { ChangeEvent, FormEvent, useState } from "react";

//components
import LoadingAnimation from "@components/LoadingAnimation";

//types
interface PropTypes {
    heading: string,
    modalAction: FormEvent,
    modalState: any,
    modalError: any,
    setModalError: any,
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    isLoading: boolean,
    setIsLoading: Function,
    setShowModal: Function
}

//icons
import {ImEye, ImEyeBlocked} from "react-icons/im";

export default function CreateProjectModal({heading, modalState, modalError, setModalError, modalAction, onChange, setShowModal, isLoading, setIsLoading} : PropTypes){
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

    function closeModal(){
        setModalError({
            inputId: null,
            message: null
        })
        setShowModal(false);
    }

    return (
       <div className={styles["modal-background"]}>
            <form onSubmit={modalAction as any}>
                <h3>{heading}</h3>
                {inputs}
                {!isLoading && 
                    <div className={styles['actions']}>
                        <button data-testid="modal-button" className={styles['modal-button']}>Submit</button>
                        <button onClick={closeModal}>Close</button>
                    </div> 
                }
                {isLoading && 
                    <LoadingAnimation/>
                }
                {modalError.message && 
                    <p data-testid="modal-error" className={styles["modal-error"]}>{modalError.message}</p>
                }
            </form>
       </div>
   ) 
}
