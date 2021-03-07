import { NextApiRequest, NextApiResponse } from "next";

//models
import UsersModel from "@models/Users"

// auth "middleware"
import {authenticateUser} from "@helpers/jwt";

export default async function(req: NextApiRequest, res: NextApiResponse){
        switch(req.method){
            case "GET":
                try {
                    authenticateUser(req, res);
                    const {id} = req.query;
                    const userId: number = parseInt(id as string);
                    if(userId === req["user"].id){
                        const user = await UsersModel.getMyProfile(req["user"].id);
                        res.status(200).json({user});
                    }else {
                        
                    }
                }catch(err){
                    console.log(err)
                    res.status(401).json({message: err.message});
                }
                break;
            default:
                res.status(404).send("Not found");
        }
    
}