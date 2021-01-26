import {SyntheticEvent, useEffect, useState} from "react";

//icons
import {ImEye, ImEyeBlocked} from "react-icons/im";

//styles for the form
import styles from "@styles/Form.module.scss";

interface Fields{
    [key: string]: string
}   

interface Field {
    name: string,
    inputType: string,
    options?: Array<string>,
    validationType?: "letters"|"email"|"numeric"|"alphanumeric"|"no-spaces"
}

interface PropTypes {
    heading: string,
    fields: Array<Field>
    buttonText: string
    action: (fieldState: Fields) => any
}

export default function useForm({heading, fields, buttonText, action} : PropTypes){
    const parseFields: Fields = {};
    for(let i = 0; i < fields.length; i++){
        parseFields[i] = ""
    }
    const [formState, updateFormState] = useState<Fields>(parseFields);
    const [showPassword, setShowPasswword] = useState<boolean>(false);
    const [formError, setFormError] = useState({
        inputId: null,
        message: ""
    });

    function updateField(e): void{
        const target: HTMLInputElement = e.target;
        updateFormState({
            ...formState,
            [target.id]: target.value
        });
    }

    function onSubmit(e: SyntheticEvent){
        setFormError({inputId: null, message: ""});
        e.preventDefault();
        if(!validate()) return;
        console.log("all checks")
        action(formState);
    }

    function validate(){
        for(let i = 0; i< fields.length; i++){
            const field = fields[i];
            if(formState[i] === ""){
                setFormError({inputId: i, message: "This field cannot be empty"})
                return false;
            }
            switch(field.validationType){
                default:
                    break;
            }
        }
        return true;
    }

    useEffect(()=>{
        return()=>{
            console.log("unmounting")
        }
    }, [])

    const inputs = [];
    for(let i = 0; i<fields.length; i++){
        const field = fields[i];
        let input;
        switch(field.inputType){
            case "email":
            case "text":
                input = <input className={formError.inputId===i? styles["input-error"]: ""} onChange={updateField} type={field.inputType} name={field.name} id={i.toString()} value={formState[field.name]}/>
                break;
            case "password":
                input = (
                    <div className={styles["password-input"]}>
                        <input className={formError.inputId===i? styles["input-error"]: ""} onChange={updateField} type={showPassword? "text": "password"} name={field.name} id={i.toString()} value={formState[field.name]}/>
                        <div onClick={()=> setShowPasswword(!showPassword)}>
                            {showPassword? <ImEye size={24}/>: <ImEyeBlocked size={24}/>}
                        </div>
                    </div>
                )
                break;
        }

        const fieldSet = (
            <fieldset key={field.name}>
                <label htmlFor={field.name}>{field.name}</label>
                {input}
            </fieldset>
        );
        inputs.push(fieldSet);
    }

    return (
        <form data-testid="form" onSubmit={onSubmit} className={styles.form}>
            <h3>{heading}</h3>
            {inputs.map(input=>input)}
            <button data-testid="form-button">{buttonText}</button>
            {formError.message &&
                <div className={styles["form-error"]}>
                    <p>{formError.message}</p>
                </div>
            }
        </form>
    );
}