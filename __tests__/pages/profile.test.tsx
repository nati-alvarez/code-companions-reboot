import {render, cleanup, fireEvent, getByLabelText} from "@testing-library/react";
import {Provider} from "jotai";

import GlobalError from "@components/GlobalError";
import GlobalSuccess from "@components/GlobalSuccess";
import Profile from "@pages/profile";

import db from "@models/db";

afterEach(cleanup);
afterAll(async ()=>{
    await db("Users").truncate();
});

import axios from "axios";
jest.mock("axios");
axios.put = jest.fn();

const mockUser = {
    "id": 1,
    "email": "test@gmail.com",
    "username": "tester",
    "name": "Test",
    "profilePicture": "",
    "joinedOn": "2021-07-27T11:35:37.355Z",
    "title": "",
    "about": "This is my bio",
    "skills": [],
    "links": []
};

const component = (
    <Provider>
        <GlobalError/>
        <GlobalSuccess/>
        <Profile userData={mockUser}/>
    </Provider>
);

it("Should render profile page", ()=> {
    const {getByText} = render(component);
    expect(getByText("Logout")).toBeTruthy();
    expect(getByText("Test")).toBeTruthy();
    expect(getByText("About Me")).toBeTruthy();
});

it("Should not render about me section if user doesn't have bio", () => {
    mockUser.about = "";
    const {queryByText} = render(component);
    expect(queryByText("About Me")).toBeFalsy();
    //re-defining for later tests
    mockUser.about = "this is my bio"
});

it("Should render skills section with no skills added message", () => {
    const {getByText} = render(component);
    expect(getByText(`${mockUser.name}'s Skills`)).toBeDefined();
    expect(getByText("You haven't added any skills.")).toBeDefined();
});

it("Should render skill tags if a user has added skills", () => {
    mockUser.skills = ['HTML', 'CSS', 'JavaScript', "randomskillnamehere"];
    const {getByText} = render(component);
    for(let skill of mockUser.skills){
        expect(getByText(skill)).toBeDefined();
    }
});

it("Should render links section with no links added message", () => {
    const {getByText} = render(component);
    expect(getByText("Social Links")).toBeDefined();
    expect(getByText("You haven't added any profile links.")).toBeDefined();
});

it("Should render user's links if a user has added links", () => {
    mockUser.links = [
        {label: "Github", url: "https://github.com/someperson/"},
        {label: "linklabel", url: "https://linkurl.com/"}
    ];

    const {getByText} = render(component);
    for(let link of mockUser.links) {
        expect(getByText(link.label)).toBeDefined();
        let linkElement: HTMLAnchorElement = getByText(link.url) as HTMLAnchorElement;
        expect(linkElement).toBeDefined();
        expect(linkElement.href).toBe(link.url);
    }
});

it("Should render modal to change profile details on button click", () => {
    const {getByText, getByTestId} = render(component);
    const editProfileButton = getByTestId("edit-profile-button");
    fireEvent.click(editProfileButton);
    expect(getByText("Edit Your Account Info")).toBeDefined();
});

it("Should update profile info when changed in the change profile details modal", async () => {
    const {getByText, getByTestId, getByLabelText, findByText, findByTestId, findByAltText} = render(component);
    
    const editProfileButton = getByTestId("edit-profile-button");
    fireEvent.click(editProfileButton);
    const profilePictureInput = getByLabelText("Profile Picture");
    const usernameInput = getByLabelText("Username");
    const nameInput = getByLabelText("Name");
    const titleInput = getByLabelText("Title");
    const aboutTextarea = getByLabelText("About");
    const submitButton = getByTestId("modal-button");
    
    fireEvent.change(profilePictureInput, {target: {value: "http://3.bp.blogspot.com/-l62If-yRVx0/T-2M1-uIu4I/AAAAAAAAAb8/5nCwdftlSb4/s1600/383179_312663185412749_1872306312893.jpg"}})
    fireEvent.change(usernameInput, {target: {value: "BrandNewUser"}});
    fireEvent.change(nameInput, {target: {value: "BrandNewName"}});
    fireEvent.change(titleInput, {target: {value: "Professional coder"}});
    fireEvent.change(aboutTextarea, {target: {value: "Hello my name is name this is stuff about me."}});
    fireEvent.click(submitButton);
   
    expect(await findByText("BrandNewName")).toBeDefined();
    expect(await findByText("@BrandNewUser")).toBeDefined();
    expect(await findByText("Professional coder")).toBeDefined();
    expect(await findByText("Hello my name is name this is stuff about me."));
    expect(await (findByAltText("Your profile picture"))).toHaveAttribute("src", "http://3.bp.blogspot.com/-l62If-yRVx0/T-2M1-uIu4I/AAAAAAAAAb8/5nCwdftlSb4/s1600/383179_312663185412749_1872306312893.jpg"); 
});
