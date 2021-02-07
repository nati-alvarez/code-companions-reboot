import { NextApiRequest, NextApiResponse } from "next";
import {verifyRefreshToken} from "@helpers/jwt";

export default function(req: NextApiRequest, res: NextApiResponse){
    if(!req.headers.cookie) return res.status(400).json({message: "Invalid token"});
    const refreshToken = req.headers.cookie.substr(req.headers.cookie.indexOf("=") + 1);
    let token = verifyRefreshToken(refreshToken);
    if(typeof token !== "string") return res.status(400).json({message: token.message});
    res.status(200).json({token});
}