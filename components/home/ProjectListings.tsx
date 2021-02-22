import {useEffect, useState} from "react";
import axios from "axios";

//styles
import styles from "@styles/ProjectListings.module.scss";

//components
import ListingCard from "./ListingCard";
import LoadingAnimation from "@components/LoadingAnimation"

export default function ProjectListings({setGlobalSuccessMessage, setGlobalErrorMessage, JWTToken, setProjectListings, listings}){
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
        axios.get(
            "/api/listings", 
            {headers: {
                "Authorization": JWTToken
            }}
        ).then(res=>{
            setProjectListings(res.data.listings);
        }).catch(err=>{
            console.log(err);
        }).finally(()=>{
            setLoading(false);
        })
    }, []);
    

    return (
        <div>
            <h3>Projects for you:</h3>
            {loading?
                <LoadingAnimation/>
            :
                <div className={styles["listings-container"]}>
                    {listings.map(listing=>{
                        return <ListingCard  key={listing.id} listing={listing}/>
                    })}
                </div>
            }
            
        </div>
    )
}