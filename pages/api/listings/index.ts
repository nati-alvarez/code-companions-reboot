//models
import ListingsModel from "@models/Listings";

//types
import { NextApiRequest, NextApiResponse } from "next";

// auth "middleware"
import {authenticateUser} from "@helpers/jwt";

export default async function (req: NextApiRequest, res: NextApiResponse){
    switch(req.method){
        case "GET":
            try {
                authenticateUser(req, res);
                const listings = await ListingsModel.getListings();
                res.status(200).json({listings});
            }catch(err){
                res.status(401).json({message: err.message});
            }
            break;
    }
}