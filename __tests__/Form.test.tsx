import Form from "@components/Form";

import {render, cleanup, fireEvent} from "@testing-library/react";

afterEach(cleanup);

const formAction = jest.fn();

let TestComponent = ()=>{
    const form = <Form 
        heading="Login"
        fields={[
            {label: "email", name: "email", inputType: "text", validationType: "letters"},
            {label: "password", name: "password", inputType: "password"}
        ]} 
        buttonText="Login" 
        action={formAction}
    />
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
    const {getByTestId, getByLabelText} = render(<TestComponent/>);
    const form = getByTestId("form");

    const emailInput = getByLabelText("email"); 
    fireEvent.change(emailInput, {target: {value: "someemail@gmail.com"}});
    const passwordInput = getByLabelText("password");
    fireEvent.change(passwordInput, {target: {value: "password"}});

    fireEvent.submit(form);
    expect(formAction).toHaveBeenCalledTimes(1);
});