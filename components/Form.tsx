import {ChangeEvent, SyntheticEvent, useEffect, useState} from "react";

//icons
import {ImEye, ImEyeBlocked} from "react-icons/im";

//styles for the form
import styles from "@styles/Form.module.scss";

interface Fields{
    [key: string]: string
}   

interface Field {
    label: string,
    name: string,
    inputType: string,
    options?: Array<string>,
    validationType?: "letters"|"email"|"numeric"|"no-spaces"|"password"
}

interface PropTypes {
    heading: string,
    formState: Object,
    formError: any,
    onChange: (event: ChangeEvent<HTMLInputElement>) => void,
    buttonText: string,
    action: Function,
}

export default function useForm({heading, formState, formError, onChange, buttonText, action} : PropTypes){
    const [showPassword, setShowPasswword] = useState<boolean>(false);

    const inputs = [];
    for(let prop in formState){
        let field = formState[prop];
        let input;
        switch(field.inputType){
            case "email":
            case "text":
                input = 
                    <fieldset key={field.label}>
                        <label htmlFor={field.label}>{field.label}</label>
                        <input 
                            className={formError.inputId===field.label? styles["input-error"]: ""} 
                            onChange={onChange} 
                            type={field.inputType} 
                            name={field.label} 
                            id={field.label} 
                            value={field.value}
                        />
                    </fieldset>
                break;
            case "password":
                input = (
                    <fieldset key={field.label.toString()}>
                        <label htmlFor={field.label.toString()}>{field.label}</label>
                        <div className={styles["password-input"]}>
                            <input 
                                className={formError.inputId===field.label? styles["input-error"]: ""} 
                                onChange={onChange} 
                                type={showPassword? "text": "password"} 
                                name={field.name} 
                                id={field.label.toString()} 
                                value={field.value}
                            />
                            <div onClick={()=> setShowPasswword(!showPassword)}>
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
        <form data-testid="form" className={styles.form}>
            <h3>{heading}</h3>
            {inputs.map(input=>input)}
            <button onClick={action as any} data-testid="form-button">{buttonText}</button>
            {formError.message &&
                <div className={styles["form-error"]}>
                    <p>{formError.message}</p>
                </div>
            }
        </form>
    );
}