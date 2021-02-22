import {useEffect, useState} from "react";
import axios from "axios";

//styles
import styles from "@styles/ProjectListings.module.scss";

//components
import ListingCard from "./ListingCard";

export default function ProjectListings({setGlobalSuccessMessage, setGlobalErrorMessage, JWTToken, setProjectListings, listings}){
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
        })
    }, []);
    

    return (
        <div>
            <h3>Projects for you:</h3>
            <div className={styles["listings-container"]}>
                {listings.map(listing=>{
                    return <ListingCard  key={listing.id} listing={listing}/>
                })}
            </div>
        </div>
    )
}