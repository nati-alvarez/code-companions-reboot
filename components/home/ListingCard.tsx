//styles
import styles from "@styles/ListingCard.module.scss";

export default function ListingCard({listing}){
    const listingDate = new Date(listing.created_at);
    return (
        <div key={listing.id} className={styles["project-listing"]}>
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
                        <span key={skill.id} className={styles["skill-tag"]}>{skill.skillName}</span>
                    )
                })}
            </div> }
        </div>
    );
}