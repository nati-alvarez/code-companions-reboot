import {SyntheticEvent, useState} from "react";
import validate from "../helpers/FormValidation";

interface Fields{
    [key: string]: Field
}   

interface Field {
    label: string,
    name: string,
    inputType: string,
    options?: Array<string>,
    validationType?: "letters"|"email"|"numeric"|"no-spaces"|"password",
    value?: ""
}

export function useForm({fields, formAction}){
    const parseFields: Fields = {};
    for(let field of fields){
        parseFields[field.label] = {
            ...field,
            value: ""
        }
    }
    const [formState, setFormState] = useState<Fields>(parseFields);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formError, setFormError] = useState({
        inputId: null,
        message: null
    });

    function onChange(e): void{
        const target: HTMLInputElement = e.target;
        setFormState({
            ...formState,
            [target.id]: {...formState[target.id], value: target.value}
        } as Fields);
    }

    function onSubmit(e: SyntheticEvent){
        setIsLoading(true);
        setFormError({inputId: null, message: null})
        e.preventDefault();
        for(const prop in formState){
            const state = formState[prop];
            if (state.value.trim() === "") {
                setFormError({inputId: state.label, message: "This field is required"});
                setIsLoading(false);
                return;
            }
            const [isValid, field, message] = validate(state);
            if(!isValid) {
                setFormError({inputId: field.label, message: message});
                setIsLoading(false);
                return;
            }
        }
        formAction(extractValuesFromFormState());
    }

    function extractValuesFromFormState(){
        const values = {};
        for(let prop in formState){
            const field = formState[prop];
            console.log(field.label.replace(" ", "_"))
            values[field.label.replace(" ", "_")] = field.value
        }
        return values;
    }

    return [formState, onChange, isLoading, setIsLoading, formError, onSubmit] as const;
}