import db from "@models/db";
import bcrypt from "bcryptjs";

export interface UserObject {
    id: number,
    email: string,
    name: string | null,
    username: string,
    password: string,
    joinedOn: string,
    profilePicture: string | null,
    title: string | null,
    about: string | null,
    githubId: string | null,
    adminLevel: 0 | 1 | 2
}

interface SignupData {
    email: string,
    username: string,
    password: string,
    githubId?: number | null
}

export default abstract class UsersModel {
    /**
     * Creates a new user and returns user info to be stored in jwt
     * @param signupData object containing all info required to signup
     * @returns User info jwt payload or error object
     */
    static async createUser(signupData: SignupData) {
        let missingFields = []
        for(let field in signupData){
            if(field === "githubId") continue;
            if(!signupData[field].trim()) missingFields.push(field);
        }
        if(missingFields[0]) throw new Error("The following fields are missing: " + missingFields.join(", "));

        const userIsTaken : string | boolean = await this.doesUserExist(signupData.username, signupData.email);
        if(userIsTaken){
            throw new Error(userIsTaken + " in use");
        }

        await db("Users").insert({
            email: signupData.email,
            username: signupData.username,
            password: bcrypt.hashSync(signupData.password, Number(process.env.HASH_ROUNDS)),
            githubId: signupData.githubId
        });
        return await db("Users")
        .where({email: signupData.email})
        .select("id", "username", "email", "githubId", "adminLevel")
        .first();
    }

    /**
     * Checks if a user login is valid and returns a payload to be passed to a JWT if it is valid,
     * if not throws an error
     * @param email - The users email
     * @param password - The users password
     * @param githubId - (optional) The users github id from github login flow, can be used instead of email and password
     * @returns User payload for JWT
     */
    static async getUserLogin(email : string = "", password : string = "", githubId : string = ""){
        const queryBy = githubId? {githubId} : {email};
        const user : UserObject = await db("Users")
        .where(queryBy)
        .first();
        if(!user) throw new Error("Incorrect username or password");
        if(password && !bcrypt.compareSync(password, user.password)) throw new Error("Incorrect username or password");
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            adminLevel: user.adminLevel,
            githubId: user.githubId
        }
    }

    /**
     * Gets a users info to view on their own private profile page
     * @param id - The id of the user
     * @returns Returns the user object with their private info
     */
    static getMyProfile(id: number){
        try {
            return db("Users")
            .where({
                id
            })
            .select(["id", "email", "username", "name", "profilePicture", "joinedOn", "title", "about"])
            .first();
        }catch(err){
            throw new Error("User not found");
        }
    }
    
    /**
    * Checks if username or email is in use
    * @param username - username in question
    * @param email - email in question
    * @return Returns the keywords "Email" or "Username" indictating which is in use or false is neither is
    */
    static async doesUserExist(username : string = "", email : string = ""){
        const user : UserObject = await db("Users").where({
            username
        }).orWhere({
            email
        }).first();
        if(!user) return false;
        if(user.email === email) return "Email"; 
        if(user.username === username) return "Username";
    }
}