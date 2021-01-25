import {useForm} from "../hooks/useForm";

import {render, cleanup, fireEvent} from "@testing-library/react";

afterEach(cleanup);

// In order to test hooks, we must render a component that uses the hook. Hooks cannot be called outside of function components: https://kentcdodds.com/blog/how-to-test-custom-react-hooks/
const formAction = jest.fn();

let TestComponent = ()=>{
    const form = useForm({
       heading: "Login",
       fields: [
           {
               name: "email",
               inputType: "text"
           },
           {
               name: "password",
               inputType: "password"
           }
       ],
       buttonText: "Login",
       action: formAction
    });
   return(form);
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
    const {getByTestId} = render(<TestComponent/>);
    const form = getByTestId("form");

    fireEvent.submit(form);
    expect(formAction).toHaveBeenCalledTimes(1);
});