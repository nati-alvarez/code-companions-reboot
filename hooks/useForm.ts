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
/**
 * Hook that setups up the basic functionality of most modals
 * 
 * @param {Object} formSetup - an object containing the fields and submit function
 * @param {Array<Object>} formSetup.fields - An array of objects defining info about the modals fields
 * @param {string} formSetup.fields.label - the label text for the input field
 * @param {string} formSetup.fields.name - the value used for the input's name attribute
 * @param {string} formSetup.fields.inputType - the value used for the input's type attribute
 * @param {string[]} formSetup.fields.options - An array of option values for select dropdowns
 * @param {string} formSetup.fields.validationType - string value representing the type of validation that should be used for 
 * the input; can be one of many predefined values (see definition for list)
 * @param {string} formSetup.fields.value - optional default value for a field
 * @param {Function} formSetup.formAction - a function that should run when the modal is submitted
 */

export function useForm({fields, formAction}){
    const parseFields: Fields = {};
    for(let field of fields){
        parseFields[field.label] = {
            ...field,
            value: field.value? field.value: ""
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
            // NOTE: We may want to check for empty input even if validationType is null and just add an additional
            // required property to achieve this functionality for optional fields instead
            if (state.validationType && state.value.trim() === "") {
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

    //nomalizes field names sent to backend into snake case
    function extractValuesFromFormState(){
        const values = {};
        for(let prop in formState){
            const field = formState[prop];
            values[field.label.replace(" ", "_")] = field.value
        }
        return values;
    }

    return [formState, onChange, isLoading, setIsLoading, formError, onSubmit] as const;
}