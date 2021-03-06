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
                let {query, option, page, listingsPerPage} = req.query as {query: string, option: string, page: string|number, listingsPerPage: string|number};
                //using undefined here because the default param values in .getListings for page and listingsPerPage won't be used if null is passed into params
                page = Number.isNaN(parseInt(page as string))? undefined: parseInt(page as string);
                listingsPerPage = Number.isNaN(parseInt(listingsPerPage as string))? undefined: parseInt(listingsPerPage as string);
                
                const searchResults = await ListingsModel.getListings({query, option, page, listingsPerPage});
                res.status(200).json({listings: searchResults.listings, totalListings: searchResults.totalListings});
            }catch(err){
                console.log(err)
                res.status(401).json({message: err.message});
            }
            break;
    }
}