import GithubAuthButton from "@components/login-signup/GithubAuthButton";
import db from "@models/db";
import {render, cleanup, fireEvent} from "@testing-library/react";
import bcrypt from "bcryptjs";

import Users from "../../models/Users";

beforeAll(async ()=>{
    await db("Users").truncate();
});
afterEach(cleanup);

it("Should create a new user without githubAccessToken", async ()=>{
    const newUser = await Users.createUser({
        email: "bob@gmail.com",
        username: "username",
        password: "password",
        githubAccessToken: null
    });
    
    expect(typeof newUser == "object" && !Array.isArray(newUser)).toBe(true);
    expect(newUser.email).toBe("bob@gmail.com");
    expect(newUser.username).toBe("username");
    expect(newUser.githubAccessToken).toBe(null);
    expect(newUser.id).toBeDefined();
    expect(newUser.adminLevel).toBe(0);
});