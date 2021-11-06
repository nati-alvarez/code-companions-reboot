import {render, fireEvent, waitFor} from "@testing-library/react";
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

it("Should show error when field incorrectly/not completed on login form", async()=>{
    const {getByLabelText, getByTestId, queryByText, findByText} = render(component);
    const loginTab = getByTestId("login-tab");
    fireEvent.click(loginTab);
 
    const email = getByLabelText("email");
    const password = getByLabelText("password");
    const button = getByTestId("form-button");
    
    fireEvent.change(email, {target: {value: ""}});
    fireEvent.change(password, {target: {value: "somepassword"}});
    fireEvent.click(button);
    expect(await findByText("This field is required")).toBeDefined(); 
   
    fireEvent.change(email, {target: {value: "a@b.c"}});
    fireEvent.change(password, {target: {value: ""}});
    fireEvent.click(button);
    expect(await findByText("This field is required")).toBeDefined();

    fireEvent.change(email, {target: {value: "a@b.c"}});
    fireEvent.change(password, {target: {value: "asdlfkjasd"}});
    fireEvent.click(button);
    await waitFor(() => {expect(queryByText("This field is required")).toBeNull()});
});

it("Should perform form validation on login input fields", async ()=>{
    const {getByLabelText, getByTestId, findByText} = render(component);
    const loginTab = getByTestId("login-tab");
    fireEvent.click(loginTab);
   
    const email = getByLabelText("email");
    const password = getByLabelText("password");
    const button = getByTestId("form-button");

    fireEvent.change(email, {target: {value: "why"}});
    fireEvent.change(password, {target: {value: "somepassword"}});
    fireEvent.click(button);
    expect(await findByText("Please enter in a valid email address")).toBeDefined();

    fireEvent.change(email, {target: {value: "why@where.how"}});
    fireEvent.change(password, {target: {value: "pass"}});
    fireEvent.click(button);
    expect(await findByText("Password must be 6 charaters or longer and contain no spaces")).toBeDefined();
});

it("Should show error on login with incorrect credentials", async ()=>{
    mockedAxios.post.mockRejectedValue({response: { data: {message: "Incorrect username or password"} } })
    const {getByLabelText, getByTestId, findByText} = render(component);
    const loginTab = getByTestId("login-tab");
    fireEvent.click(loginTab);
   
    const email = getByLabelText("email");
    const password = getByLabelText("password");
    const button = getByTestId("form-button");
  
    fireEvent.change(email, {target: {value: "aasdafd@gmail.com"}});
    fireEvent.change(password, {target: {value: "somepassword"}});
    fireEvent.click(button);
   
    expect(await findByText("Incorrect username or password")).toBeDefined();
});

it("Should redirect on successful login", async ()=>{
    mockedAxios.post.mockResolvedValue({response: { data: {message: "Login successful"} } });
    
    const {getByLabelText, getByTestId, getByText, queryByText} = render(component);
    const loginTab = getByTestId("login-tab");
    fireEvent.click(loginTab);
    
    const email = getByLabelText("email");
    const password = getByLabelText("password");
    const button = getByTestId("form-button");
  
    fireEvent.change(email, {target: {value: "test@email.com"}});
    fireEvent.change(password, {target: {value: "testpassword"}});
    fireEvent.click(button);
    await waitFor(() => expect(queryByText("Incorrect username or password")).toBeNull());
});

