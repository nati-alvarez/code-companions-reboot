//styles
import listings from "@pages/api/listings";
import styles from "@styles/ListingCard.module.scss";

export default function ListingCard({listing}){
    const listingDate = new Date(listing.created_at);
    return (
        <div className={styles["project-listing"]}>
            <div className={styles["listing-header"]}>
                <h4>{listing.listingTitle}</h4>
                <time>{listingDate.toLocaleDateString()}</time>
            </div>
            <div className={styles["project-owner"]}>
                <img width="35" src={listing.ownerProfilePicture? listing.ownerProfilePicture: "/logo-m.png"} alt="The project owner"/>
                <p>{listing.ownerUsername}</p>
            </div>
            <p className={styles["listing-description"]}>
                {listing.description}
            </p>
            {listing.skills[0] && <div className={styles["required-skills"]}>
                {listing.skills.map(skill=>{
                    return (
                        <span className={styles["skill-tag"]}>{skill.skillName}</span>
                    )
                })}
            </div> }
        </div>
    );
}