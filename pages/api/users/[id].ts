import { NextApiRequest, NextApiResponse } from "next";

//models
import UsersModel from "@models/Users"

// auth "middleware"
import {authenticateUser} from "@helpers/jwt";

export default async function(req: NextApiRequest, res: NextApiResponse){
        try {
            authenticateUser(req, res);
        }catch(err){
            console.log(err)
            res.status(401).json({message: err.message});
        }

        switch(req.method){
            case "GET":
                try {
                    const {id} = req.query;
                    const userId: number = parseInt(id as string);
                    if(userId === req["user"].id){
                        const user = await UsersModel.getMyProfile(req["user"].id);
                        res.status(200).json({user});
                    }else {
                        
                    }
                }catch(err){
                    console.log(err);
                    res.status(500).json({message: err.message});
                }
                break;
            case "PUT":
                try {
                    const id : string = req.query.id as string;
                    // When calling .update() on knex models, if a field is unique and you try chainging it to 
                    // a value that already exists in the db you get a unique constraint error EVEN IF the field of the record being edited holds
                    // that unique value. This line will prevent that error
                    if(req["user"].username === req.body.username) delete req.body.username;
                    await UsersModel.updateUserInfo(id, req.body);
                    const user = await UsersModel.getMyProfile(parseInt(id));
                    res.status(200).json({message: "Your profile was updated successfuly", user});
                }catch(err){
                    console.log(err);
                    res.status(500).json({message: err.message});
                }
                break;
            default:
                res.status(404).send("Not found");
        }
    
}