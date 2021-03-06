import db from "@models/db";
import {cleanup} from "@testing-library/react";

import Users from "../../models/Users";

beforeAll(async ()=>{
    await db("Users").truncate();
});
afterEach(cleanup);

describe("createUser method", ()=>{
    it("Should create a new user without githubId", async ()=>{
        const newUser = await Users.createUser({
            email: "bob@gmail.com",
            username: "username",
            password: "password",
            githubId: null
        });

        expect(typeof newUser == "object" && !Array.isArray(newUser)).toBe(true);
        expect(newUser.email).toBe("bob@gmail.com");
        expect(newUser.username).toBe("username");
        expect(newUser.githubId).toBe(null);
        expect(newUser.id).toBeDefined();
        expect(newUser.adminLevel).toBe(0);
    });

    it("Should create a new user with a githubId", async ()=>{
        const newUser = await Users.createUser({
            email: "someone@gmail.com",
            username: "user",
            password: "pass",
            githubId: 1234
        });
        expect(typeof newUser == "object" && !Array.isArray(newUser)).toBe(true);
        expect(newUser.email).toBe("someone@gmail.com");
        expect(newUser.username).toBe("user");
        expect(newUser.githubId).toBe(1234);
        expect(newUser.id).toBeDefined();
        expect(newUser.adminLevel).toBe(0);
    });

    it("Should not create a new user if any requried information not given", async()=>{
        expect(Users.createUser({
            email: "",
            username: "",
            password: "",
            githubId: null
        })).rejects.toThrow();

        try {
            await Users.createUser({
                email: "",
                username: "",
                password: "",
                githubId: null
            });
        }catch(err){
            expect(err.message).toBe("The following fields are missing: email, username, password");
        }
    });

    it("Should not create a new user if username or email is taken", async ()=>{
        expect(
            Users.createUser({
                email: "bob@gmail.com",
                username: "username",
                password: "password",
                githubId: null
            })
        ).rejects.toThrow();

        try {
            await Users.createUser({
                email: "bob@gmail.com",
                username: "somethingelse",
                password: "password",
                githubId: null
            });
        }catch(err){
            expect(err.message).toBe("Email in use");
        }

        try {
            await Users.createUser({
                email: "someother@emailaddress.com",
                username: "username",
                password: "password",
                githubId: null
            });
        }catch(err){
            expect(err.message).toBe("Username in use");
        }
    });
});