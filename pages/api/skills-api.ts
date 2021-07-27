import {NextApiRequest, NextApiResponse} from "next";
import axios from "axios";

import {authenticateUser} from "@helpers/jwt";

export default async function(req: NextApiRequest, res: NextApiResponse){
    try {
        authenticateUser(req, res);
        const skills = await axios.get(`https://trendyskills.com/service?q=keywords&like=${req.body.query}&key=${process.env.TRENDY_SKILLS_API_KEY}`);
        // trendy skills api can sometimes still respond with 200 code even if an error occurred.
        // this will cover that edge case
        if(typeof skills.data === "string") {
            const data = JSON.parse(skills.data.substr(0, skills.data.length - 2)); // the data json string is wrapped in () when an error is thrown for some reason
            console.log(data);
            res.status(401).json({message: data.error_message[0]});
        }else {
            res.json(skills.data.keywords);
        }
    }catch(err){
        console.log(err);
        res.status(401).json({message: err.message});
    }
}