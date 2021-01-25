import {render, cleanup, fireEvent} from "@testing-library/react";

import LoginSignup from "../../pages/login-signup";

afterEach(cleanup)

it("Should render login/signup page", ()=> {
    //initial render will have login page first
    const {getByText, getAllByText, getByLabelText} = render(<LoginSignup/>);
    expect(getByText("Welcome! Please login or sign up to get started")).toBeTruthy();

    const loginText = getAllByText("Login");
    expect(loginText[loginText.length - 1]).toBeTruthy();
    expect(loginText[0]).toBeTruthy();
    expect(getByLabelText("email")).toBeTruthy();
    expect(getByLabelText("password")).toBeTruthy();
});

it("Should change form on form tab click", async ()=>{
    const {getAllByText, getByLabelText, getByTestId} = render(<LoginSignup/>);
    const loginTab = getByTestId("login-tab");
    const signupTab = getByTestId("signup-tab");

    fireEvent.click(loginTab);
    const loginText = getAllByText("Signup");
    expect(loginText[loginText.length - 1]).toBeTruthy();
    expect(loginText[0]).toBeTruthy();
    expect(getByLabelText("email")).toBeTruthy();
    expect(getByLabelText("password")).toBeTruthy();
    expect(getByTestId('form-button').textContent).toBe("Login");
    expect(loginTab.className).toBe("active");

    fireEvent.click(signupTab);

    const signupText = getAllByText("Signup");
    expect(signupText[signupText.length - 1]).toBeTruthy();
    expect(signupText[0]).toBeTruthy();
    expect(getByLabelText("email")).toBeTruthy();
    expect(getByLabelText("password")).toBeTruthy();
    expect(getByTestId('form-button').textContent).toBe("Signup");
    expect(signupTab.className).toBe("active");
})

