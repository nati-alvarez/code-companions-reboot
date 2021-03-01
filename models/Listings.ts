import db from "./db";

interface ListingSearchFilters {
    query: string,
    option: string
}

export default abstract class ListingsModel {
    static async getListings(filters: ListingSearchFilters){
        let listings = await db("Listings as l")
            .join("Projects as p", "p.id", "l.projectId")
            .join("Users as u", "u.id", "p.ownerId")
            .select(["l.id", "l.listingTitle", "l.description", "l.created_at", "u.id as ownerId", "u.username as ownerUsername", "u.profilePicture as ownerProfilePicture"])
            .where({"l.public": true})
            .modify(function(queryBuilder) {
                if (filters.query && filters.query != null) {
                    queryBuilder.whereRaw('LOWER("listingTitle") LIKE ?', `%${filters.query.toLowerCase()}%`);
                }
                switch(filters.option){
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
        return listings;
    }
}