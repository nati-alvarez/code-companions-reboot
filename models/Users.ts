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
        if(email && password && !bcrypt.compareSync(password, user.password)) throw new Error("Incorrect username or password");
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
    static async getMyProfile(id: number){
        try {
            const user = await db("Users")
            .where({
                id
            })
            .select(["id", "email", "username", "name", "profilePicture", "joinedOn", "title", "about"])
            .first();
            
            const userSkills = await db("UserSkills")
            .where({
                userId: user.id
            }).pluck("skillName"); //pluck method returns column as is, not wrapping it in an object. pretty neat!

            const userLinks = await db("UserLinks")
            .where({
                userId: user.id
            }).select("id", "label", "url");

            user.skills = userSkills;
            console.log(userLinks)
            user.links = userLinks;
            return user;
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
    static async doesUserExist(username : string = "", email : string = "", userId: string | null = null){
        const user : UserObject = await db("Users")
        .where(function(){
            this.where("username", username);
            if(userId) this.andWhere("id", "!=", userId);
        }).orWhere(function(){
            this.where("email", email);
            if(userId) this.andWhere("id", "!=", userId);
        }).first();
        
        if(!user) return false;
        if(user.email === email) return "Email"; 
        if(user.username === username) return "Username";
    }

    /**
     * Updates user profile info, user skills, and profile links.
     * All fields are optional and only the fields passed (if valid) are updated
     * @param userId ID of the user being updated
     * @param changes Object of fields to be changed with their new values
     */
    static async updateUserInfo(userId, changes){
        let isUsernameOrEmailTaken;
        if(changes.email || changes.username){
            isUsernameOrEmailTaken = await this.doesUserExist(changes.username, changes.email, userId);
        }
        if(isUsernameOrEmailTaken) throw new Error(`${isUsernameOrEmailTaken} is taken`);
        
        this.validateReqBodyFields(changes);
        if(changes.skills){
            // the skills property gets uploaded as an array of all skills a user wants to have on their account, no information
            // about which skills should be removed, added, or left alone is included.
            // So, here we delete all a users skills first because we'll re-upload duplicates otherwise, which causes a unique constraint error
            // NOTE: We should potentially find a better way to do this, so all the skills don't have to be bulk deleted and uploaded each time
            await db("UserSkills").del().where({userId})
            await db("UserSkills").insert(changes.skills);
            // removing the property here so it doesn't affect any other updates
            delete changes.skills;
        }
        
        console.log(changes)
        if(changes.links){
            // same as skills
            await db("UserLinks").del().where({userId})
            await db("UserLinks").insert(changes.links);

            delete changes.links;
        }

        if(Object.keys(changes).length > 0){
            await db("Users").update({
                ...changes
            }).where({
                id: userId
            });
        }


    }

    // We will use this to validate that data received from a request body will only attempt to apply updates to valid user fields
    private static validUserProps = {
        "email":1, 
        "name":1, 
        "username": 1, 
        "password":1, 
        "joinedOn": 1, 
        "profilePicture": 1, 
        "title":1, 
        "about":1, 
        "githubId":1, 
        "adminLevel": 1,
        "skills":1,
        "links": 1
    }

    /**
     * Ensures the fields in the request body are valid fields on the Users model. Mutates the object by removing invalid fields.
     * @param fields Object of fields in request body to be checked against list of valid user fields
     * @returns void
     */
    private static validateReqBodyFields(fields){
        for(let field in fields){
            if(!this.validUserProps[field]) delete fields[field];
        }
    }
}