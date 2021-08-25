import { NextApiRequest, NextApiResponse } from "next";
import UsersModel from "@models/Users";
import {serialize} from "cookie";


import { authenticateUser } from "@helpers/jwt";

export default function (req: NextApiRequest, res: NextApiResponse) {
    //TODO: Implement a token blacklist for tokens not-yet expired
    //If possible, store in something like redis and have them auto-delete once expiration date has passed
    try {
        authenticateUser(req, res);
        res.setHeader(
            "Set-Cookie",
            serialize("rt", "", {
                maxAge: -1,
                path: '/',
            })
        );
        res.status(200).json({message: "logout successful"});
    } catch (err) {
        console.log(err);
        res.status(401).json({message: err.message});     
    }
}