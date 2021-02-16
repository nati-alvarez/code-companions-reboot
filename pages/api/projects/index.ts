import { NextApiRequest, NextApiResponse } from "next";
import ProjectsModel from "@models/Projects";

import {authenticateUser} from "@helpers/jwt";

export default async function(req: NextApiRequest, res: NextApiResponse){
    switch(req.method){
        case "GET":
            try{
                authenticateUser(req, res);   
                console.log(req['user']);
                const projects = await ProjectsModel.getUserProjects(req['user'].id);
                res.status(200).json({projects});
            }catch(err){
                res.status(401).json({message: err.message});
            }
    }
}