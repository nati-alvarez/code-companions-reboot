import { NextApiRequest, NextApiResponse } from "next";
import UsersModel from "@models/Users";
import {serialize} from "cookie";
import {generateAuthToken, generateRefreshToken} from "@helpers/jwt";


interface LoginReqBody {
    email : string
    password: string
}

export default async function(req: NextApiRequest, res: NextApiResponse){
    switch(req.method){
        case "POST":
            const {email, password} : LoginReqBody = req.body;
            if(!email || !password) return res.status(400).json({message: "Username and password required"});
            try {
                const userPayload = await UsersModel.getUserLogin(email, password);
                const refreshToken = generateRefreshToken(userPayload);
                const authToken = generateAuthToken(userPayload);
                const today = new Date();
                const cookieExpiryDate = today.setDate(today.getDate() + 2);
                res.setHeader(
                    "Set-Cookie",
                    serialize("rt", refreshToken, {
                        httpOnly: true,
                        expires: new Date(cookieExpiryDate),
                        maxAge:  60 * 60 * 24 * 2,
                        path: "/",
                        secure: process.env.NODE_ENV === "production"
                    })
                );
                res.status(200).json({message: "Login successful", authToken});
            }catch(err){
                res.status(400).json({message: err.message})
            }
            break;
    }
}