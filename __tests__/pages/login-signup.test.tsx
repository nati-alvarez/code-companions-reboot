import {render, cleanup, fireEvent, act, waitFor, wait} from "@testing-library/react";
import {Provider} from "jotai"

import GlobalError from "@components/GlobalError";
import GlobalSuccess from "@components/GlobalSuccess";
import LoginSignup from "../../pages/login-signup";

//mock functions
import axios from "axios";
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

import db from "@models/db";
import UsersModel from "@models/Users";
beforeAll(async ()=>{
    await db("Users").truncate();
    await UsersModel.createUser({
        email: "test@email.com",
        username: "test",
        password: "testpassword"
    });
});
afterEach(cleanup)
afterAll(async ()=>{
    await db("Users").truncate();
});

const component = (
    <Provider>
        <GlobalError/>
        <GlobalSuccess/>
        <LoginSignup/>
    </Provider>
)

it("Should render login/signup page", ()=> {
    //initial render will have login page first
    const {getByText, getAllByText, getByLabelText} = render(component);
    expect(getByText("Welcome! Please login or sign up to get started")).toBeTruthy();

    const loginText = getAllByText("Login");
    expect(loginText[loginText.length - 1]).toBeTruthy();
    expect(loginText[0]).toBeTruthy();
    expect(getByLabelText("email")).toBeTruthy();
    expect(getByLabelText("password")).toBeTruthy();
});

it("Should change form on form tab click", async ()=>{
    const {getAllByText, getByLabelText, getByTestId} = render(component);
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
});

it("Should show error when field incorrectly/not completed", async()=>{
    const {getByLabelText, getByTestId, getByText} = render(component);
    const email = getByLabelText("email");
    const password = getByLabelText("password");
    const button = getByTestId("form-button");
    
    await fireEvent.change(email, {target: {value: ""}});
    await fireEvent.change(password, {target: {value: "somepassword"}});
    await fireEvent.click(button);
    expect(getByText("This field is required")).toBeDefined();
    
    await fireEvent.change(email, {target: {value: "a@b.c"}});
    await fireEvent.change(password, {target: {value: ""}});
    await fireEvent.click(button);
    
    expect(getByText("This field is required")).toBeDefined();

    await fireEvent.change(email, {target: {value: "a@b.c"}});
    await fireEvent.change(password, {target: {value: "asdlfkjasd"}});
    await fireEvent.click(button);
    waitFor(()=>{
        expect(getByText("This field is required")).not.toBeDefined();
    });
});

it("Should perform form validation on input fields", async ()=>{
    const {getByLabelText, getByTestId, getByText} = render(component);
    const email = getByLabelText("email");
    const password = getByLabelText("password");
    const button = getByTestId("form-button");

    await fireEvent.change(email, {target: {value: "why"}});
    await fireEvent.change(password, {target: {value: "somepassword"}});
    await fireEvent.click(button);
    waitFor(()=>{
        expect(getByText("Please enter in a valid email address")).toBeDefined();
    });

    await fireEvent.change(email, {target: {value: "why@fuckyou.cunt"}});
    await fireEvent.change(password, {target: {value: "pass"}});
    await fireEvent.click(button);
    waitFor(()=>{
        expect(getByText("Password must be 6 charaters or longer and contain no spaces")).toBeDefined();
    });
});

it("Should show error on login with incorrect credentials", ()=>{
    mockedAxios.post.mockRejectedValue({response: { data: {message: "Incorrect username or password"} } })
    const {getByLabelText, getByTestId, findByText} = render(component);
    const loginTab = getByTestId("login-tab");
    const email = getByLabelText("email");
    const password = getByLabelText("password");
    const button = getByTestId("form-button");
  
    fireEvent.click(loginTab);
    fireEvent.change(email, {target: {value: "aasdafd@gmail.com"}});
    fireEvent.change(password, {target: {value: "somepassword"}});
    fireEvent.click(button);
    
    expect(findByText("Incorrect username or password")).toBeDefined();
});

it("Should redirect on successful login", async ()=>{
    mockedAxios.post.mockResolvedValue({response: { data: {message: "Login successful"} } });
    const {getByLabelText, getByTestId, getByText} = render(component);
    const loginTab = getByTestId("login-tab");
    const email = getByLabelText("email");
    const password = getByLabelText("password");
    const button = getByTestId("form-button");
  
    await fireEvent.click(loginTab);
    await fireEvent.change(email, {target: {value: "test@email.com"}});
    await fireEvent.change(password, {target: {value: "testpassword"}});
    await fireEvent.click(button);
    waitFor(()=> expect(mockedAxios.post).toHaveBeenCalledTimes(1));
});

