import db from "./db";

interface ListingSearchFilters {
    query: string,
    option: string,
    page?: number,
    listingsPerPage?: number
}

export default abstract class ListingsModel {
    static async getListings({query, option, page=1, listingsPerPage=10}: ListingSearchFilters){
        let dbQuery = db("Listings as l")
            .join("Projects as p", "p.id", "l.projectId")
            .join("Users as u", "u.id", "p.ownerId")
            .select(["l.id", "l.listingTitle", "l.description", "l.created_at", "u.id as ownerId", "u.username as ownerUsername", "u.profilePicture as ownerProfilePicture"])
            .where({"l.public": true})
            .modify(function(queryBuilder) {
                if (query && query != null) {
                    queryBuilder.whereRaw('LOWER("listingTitle") LIKE ?', `%${query.toLowerCase()}%`);
                }
                switch(option){
                    case "newest":
                        queryBuilder.orderBy("created_at", "desc");
                        break;
                    case "oldest":
                        queryBuilder.orderBy("created_at", "asc");
                    default:
                        queryBuilder.orderBy("created_at", "desc");
                        break;
                }
            });
        //this will be requried in listingsorder for the front-end to setup pagination
        const totalListings = (await dbQuery).length;

        dbQuery.limit(listingsPerPage).offset((page - 1) * listingsPerPage);
        let listings = await dbQuery;
        
        for (let listing of listings){
            try {
                const skills = await db("ListingSkills")
                    .where({listingId: listing.id})
                    .select(["id", "skillName"]);
                listing.skills = skills;
            }catch(err){
                //don't throw error, just don't show any required skills
                console.log(err, err.message);
                listing.skills = [];
            }
        }
        return {listings, totalListings};
    }
}