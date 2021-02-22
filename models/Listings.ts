import db from "./db";

export default abstract class ListingsModel {
    static async getListings(){
        let listings = await db("Listings as l")
            .join("Projects as p", "p.id", "l.projectId")
            .join("Users as u", "u.id", "p.ownerId")
            .select(["l.id", "l.listingTitle", "l.description", "l.created_at", "u.id as ownerId", "u.username as ownerUsername", "u.profilePicture as ownerProfilePicture"])
            .where({"l.public": true});
        
        for (let listing of listings){
            try {
                const skills = await db("ListingSkills")
                    .where({listingId: listing.id})
                    .select(["id", "skillName"]);
                    
                listing.skills = skills;
            }catch(err){
                //don't break app just don't show any required skills
                console.log(err, err.message);
                listing.skills = [];
            }
        }
        return listings;
    }
}