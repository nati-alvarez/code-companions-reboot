import { NextApiRequest, NextApiResponse } from "next";
import {verifyRefreshToken} from "@helpers/jwt";
import cookie from "cookie";

export default function(req: NextApiRequest, res: NextApiResponse){
    switch(req.method){
        case "POST":
            if(!req.headers.cookie) return res.status(400).json({message: "Invalid token"});
            const refreshToken = cookie.parse(req.headers.cookie).rt;
            let token = verifyRefreshToken(refreshToken);
            if(typeof token !== "string") return res.status(400).json({message: token.message});
            res.status(200).json({token});
            break;
        default:
            res.status(404).send("Page not found");
    }
   
}