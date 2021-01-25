import {SyntheticEvent, useState} from "react";

//styles for the form
import styles from "@styles/Form.module.scss";

interface Fields{
    [key: string]: string
}   

interface Field {
    name: string,
    inputType: string,
    options?: Array<string>
}

interface PropTypes {
    heading: string,
    fields: Array<Field>
    buttonText: string
    action: (fieldState: Fields) => any
}

export function useForm({heading, fields, buttonText, action} : PropTypes){
    const parseFields = {};
    for(let field of fields){
        parseFields[field.name] = ""
    }
    const [formState, updateFormState] = useState<Fields>(parseFields);
    
    function updateField(e): void{
        const target: HTMLInputElement = e.target;
        updateFormState({
            ...formState,
            [target.name]: target.value
        });
    }

    function onSubmit(e: SyntheticEvent){
        e.preventDefault();
        action(formState);
    }

    const inputs = [];
    for(let field of fields){
        let input;
        switch(field.inputType){
            case "email":
            case "text":    
            case "password":
                input = <input onChange={updateField} type={field.inputType} name={field.name} id={field.name} value={formState[field.name]}></input>
        }

        const fieldSet = (
            <fieldset key={field.name}>
                <label htmlFor={field.name}>{field.name}</label>
                {input}
            </fieldset>
        );
        inputs.push(fieldSet);
    }

    const form = (
        <form data-testid="form" onSubmit={onSubmit} className={styles.form}>
            <h3>{heading}</h3>
            {inputs.map(input=>input)}
            <button data-testid="form-button">{buttonText}</button>
        </form>
    );
    

    return form;
}