import { NextApiRequest, NextApiResponse } from "next";
import ProjectsModel from "@models/Projects";

import {authenticateUser} from "@helpers/jwt";

export default async function(req: NextApiRequest, res: NextApiResponse){
    try {
        authenticateUser(req, res);
    }catch(err){
        res.status(401).json({message: err.message});
    }
    switch(req.method){
        case "GET":
            try{
                const projects = await ProjectsModel.getUserProjects(req['user'].id);
                res.status(200).json({projects});
            }catch(err){
                res.status(500).json({message: err.message});
            }
            break;
        case "POST":
            try {
                const {title, description, github_repo} = req.body;
                const project = await ProjectsModel.createProject({title, description, github_repo, ownerId: req["user"].id});
                res.status(201).json({message: "Project created", project});
            }catch(err){
                res.status(500).json({message: err.message});
            }
    }
}