import { NextApiRequest, NextApiResponse } from "next";

interface LoginReqBody {
    email : string
    password: string
}

export default function(req: NextApiRequest, res: NextApiResponse){
    switch(req.method){
        case "POST":
            const {email, password} : LoginReqBody = req.body;
            if(!email || !password) return res.status(400).json({message: "Username and password required"});
            res.status(200).json({message: "logging you in"});
            break;
    }
}