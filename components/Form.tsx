import {SyntheticEvent, useEffect, useState} from "react";

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
        const postData = {};
        for(let key in fields){
            console.log(fields[key])
            postData[fields[key].label] = formState[key];
        }
        action(postData);
    }

    function validate(){
        for(let i = 0; i< fields.length; i++){
            const field = fields[i];
            if(formState[i] === ""){
                setFormError({inputId: i, message: "This field cannot be empty"});
                return false;
            }
            switch(field.validationType){
                case "email":
                    const emailRegex = /\S+@\S+\.\S+/;
                    if(!emailRegex.test(formState[i])) {
                        setFormError({inputId: i, message: "Please use a valid email"});
                        return false;
                    }
                    break;
                case "no-spaces":
                    const format = /^[\w\d]+[\w\d_-]$/;
                    if(!format.test(formState[i])){
                        setFormError({inputId: i, message: "This field must begin with a letter and only contain letters, numbers, and the charaters ' - ' and ' _ '"});
                        return false;
                    }
                    break;
                case "password":
                    const spaces = /^\S*$/
                    if(formState[i].length < 6 || !spaces.test(formState[i])){
                        setFormError({inputId: i, message: "Password must be longer than 5 characters and contain no spaces"});
                        return false;
                    }
                    break;
                case "numeric":
                    const numbers = /^\d*$/;
                    if(!numbers.test(formState[i])){
                        setFormError({inputId: i, message: "This field may only contain numbers"});
                        return false;
                    }
                    break;
                case "letters":
                    const letters = /^\w*$/;
                    if(!letters.test(formState[i])){
                        setFormError({inputId: i, message: "This field may only contain letters"});
                        return false;
                    }
                    break;
            }
        }
        return true;
    }

    const inputs = [];
    for(let i = 0; i<fields.length; i++){
        const field = fields[i];
        let input;
        switch(field.inputType){
            case "email":
            case "text":
                input = 
                    <fieldset key={i.toString()}>
                        <label htmlFor={i.toString()}>{field.label}</label>
                        <input 
                            className={formError.inputId===i? styles["input-error"]: ""} 
                            onChange={updateField} 
                            type={field.inputType} 
                            name={field.name} 
                            id={i.toString()} 
                            value={formState[field.name]}
                        />
                    </fieldset>
                break;
            case "password":
                input = (
                    <fieldset key={i.toString()}>
                        <label htmlFor={i.toString()}>{field.label}</label>
                        <div className={styles["password-input"]}>
                            <input 
                                className={formError.inputId===i? styles["input-error"]: ""} 
                                onChange={updateField} 
                                type={showPassword? "text": "password"} 
                                name={field.name} 
                                id={i.toString()} 
                                value={formState[field.name]}
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