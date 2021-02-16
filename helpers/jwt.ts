import jwt from "jsonwebtoken";
import {NextApiRequest, NextApiResponse} from "next";

export function generateRefreshToken(payload: object){
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2d"
    });
}

export function generateAuthToken(payload: object){
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "20m"
    });
}

export function verifyRefreshToken(refreshToken: string){
    try{
        const data = jwt.verify(refreshToken, process.env.JWT_SECRET);
        return generateAuthToken({id: data.id, username: data.username});
    }catch(err){
        return new Error("Invalid token");
    }
}

export function authenticateUser(req: NextApiRequest, res: NextApiResponse){
    const token = req.headers.authorization;
    try{
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req['user'] = user; //using bracket syntax, otherwise typescript complains
    }catch(err){
        throw new Error("Invalid token");
    }
}