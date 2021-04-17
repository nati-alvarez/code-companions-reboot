import {NextApiRequest, NextApiResponse} from "next";
import axios from "axios";

import {authenticateUser} from "@helpers/jwt";

export default async function(req: NextApiRequest, res: NextApiResponse){
    try {
        authenticateUser(req, res);
        const skills = await axios.get(`https://trendyskills.com/service?q=keywords&like=${req.body.query}&key=${process.env.TRENDY_SKILLS_API_KEY}`);
        console.log(skills);
        res.json(skills.data.keywords);
    }catch(err){
        console.log(err);
        res.status(401).json({message: err.message});
    }
}