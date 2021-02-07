import { NextApiRequest, NextApiResponse } from "next";
import UsersModel from "@models/Users";
import {UserObject} from "@models/Users";

export default async function(req: NextApiRequest, res: NextApiResponse){
    switch(req.method){
        case "POST":
            try{
                const newUser : UserObject = await UsersModel.createUser(req.body);
                res.status(201).json({message: "Account made. Login to continue"})
            }catch(err){
                res.status(400).json({message: err.message})
            }
            break;
    }
}