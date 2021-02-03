import {ChangeEvent} from "react";
import Form from "@components/Form";
import {useForm} from "@hooks/useForm";
import {render, cleanup, fireEvent, waitFor} from "@testing-library/react";

afterEach(cleanup);

// In order to test hooks, we must render a component that uses the hook. Hooks cannot be called outside of function components: https://kentcdodds.com/blog/how-to-test-custom-react-hooks/
const formAction = jest.fn();

let TestComponent = ()=>{
    const [loginFormState, onLoginChange, loginFormError, onLoginSubmit] = useForm({
        fields: [ 
            {label: "email", name: "email", inputType: "text", validationType: "email"},
            {label: "password", name: "password", inputType: "password", validationType: "password"}
        ], 
        formAction: formAction
    });
    const LoginForm = <Form 
        heading="Login"
        formState={loginFormState}
        formError={loginFormError}
        buttonText="Login" 
        action={onLoginSubmit as Function}
        onChange={onLoginChange as (event: ChangeEvent<HTMLInputElement>)=> void}
    />
   return(LoginForm);
 }

it("Should correctly render form", ()=>{
   const {getByLabelText, getByTestId} = render(<TestComponent/>);
   expect(getByLabelText("email")).toBeTruthy()
   expect(getByLabelText("password")).toBeTruthy();
   expect(getByTestId("form-button")).toBeTruthy();
});

it("Should update state values on input change event", ()=>{
    //NOTE:
    //in order for this test to accurately represent the behavior we want
    //the value of each input must be set to the state value it's changing
    const {getByLabelText} = render(<TestComponent/>);

    const emailInput = getByLabelText("email");
    fireEvent.change(emailInput, {target: {value: "someemail@gmail.com"}});
    expect(emailInput).toHaveValue("someemail@gmail.com");

    const passwordInput = getByLabelText("password");
    fireEvent.change(passwordInput, {target: {value: "password"}});
    expect(passwordInput).toHaveValue("password");
});

it("Should run the submit function on submit", ()=>{
    const {getByTestId, getByLabelText} = render(<TestComponent/>);

    const emailInput = getByLabelText("email"); 
    fireEvent.change(emailInput, {target: {value: "someemail@gmail.com"}});
   
    const passwordInput = getByLabelText("password");
    fireEvent.change(passwordInput, {target: {value: "password"}});
    
    const formButton = getByTestId("form-button");
    fireEvent.click(formButton);
    expect(formAction).toHaveBeenCalledTimes(1);
});