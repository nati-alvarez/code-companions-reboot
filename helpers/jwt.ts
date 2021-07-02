import jwt from "jsonwebtoken";
import {NextApiRequest, NextApiResponse} from "next";

/**
 * Generates the refresh token
 * @param {object} payload - the payload to store in the JWT
 * @returns {string} the json webtoken
 */
export function generateRefreshToken(payload: object) : string{
    return jwt.sign(payload, process.env.REFRESH_JWT_SECRET, {
        expiresIn: "2d"
    });
}

/**
 * Generates the auth token
 * @param {object} payload - the payload to store in the JWT
 * @returns {string} the json webtoken
 */
export function generateAuthToken(payload: object) : string{
    return jwt.sign(payload, process.env.AUTH_JWT_SECRET, {
        expiresIn: "20m"
    });
}

/**
 * Verifies the refresh token. Returns token when successful and Error instance when unsuccessful
 * @param {string} refreshToken - the refresh token to verify
 * @returns {string} the JWT when verification is successful
 * @returns {Error} an Error instance when verification is unsuccessful
 */
export function verifyRefreshToken(refreshToken: string) : Error | string {
    try{
        const data = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
        return generateAuthToken({id: data.id, username: data.username});
    }catch(err){
        return new Error("Invalid token");
    }
}

/**
 * Authenticates the auth token. Sets user info in payload to request object when successful
 * and returns Error instance when unsuccessful
 * @param {NextApiRequest} req - Next API request object
 * @param {NextApiResponse} res - Next API response object
 * @returns {Error} an Error instance when verification is unsuccessful
 */
export function authenticateUser(req: NextApiRequest, res: NextApiResponse) : undefined | Error {
    const token = req.headers.authorization;
    try{
        const user = jwt.verify(token, process.env.AUTH_JWT_SECRET);
        req['user'] = user; //using bracket syntax, otherwise typescript complains
    }catch(err){
        return new Error("Invalid token");
    }
}