import {useEffect, useRef, useState} from "react";
import axios from "axios";

//styles
import styles from "@styles/ProjectListings.module.scss";

//components
import ListingCard from "./ListingCard";
import LoadingAnimation from "@components/LoadingAnimation"
import { useRouter } from "next/router";

export default function ProjectListings({setGlobalSuccessMessage, setGlobalErrorMessage, JWTToken, setProjectListings, listings}){
    const [loading, setLoading] = useState(true);
    const [listingFilters, setListingFilters] = useState({
        query: null,
        option: "newest"
    });
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

    //gets all listings without filtering by keyword when keyword is empty
    useEffect(()=>{
        console.log(listingFilters.query == "")
        if(listingFilters.query == "") getListings();
    }, [listingFilters.query]);

    const getListings = async () => {
        setLoading(true);
        //null will be passed in as the string "null" so checking here it before adding it to url
        let queryString = `?option=${listingFilters.option}` 
        queryString += (listingFilters.query)? `&query=${listingFilters.query}`: "";
        try {
            const res = await axios.get(
                `/api/listings${queryString}`,
                {headers: {
                    "Authorization": JWTToken
                }}    
            )
            setProjectListings(res.data.listings)
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }
    

    return (
        <div>
            <h3>Projects for you:</h3>
            <div className={styles["listings-filters"]}>
                <fieldset>
                    <label>Search by title: </label>
                    <input onKeyUp={(e)=> {if(e.keyCode === 13) getListings()}} onChange={e => setListingFilters({...listingFilters, query: e.target.value})} />
                </fieldset>
                <select onChange={e => setListingFilters({...listingFilters, option: e.target.value})}>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                </select>
                <button onClick={getListings} className={styles["filter-button"]}>Find</button>
            </div>
            {loading?
                <LoadingAnimation/>
            :
                <>
                    <div className={styles["listings-container"]}>
                        {listings.map(listing=>{
                            return <ListingCard key={listing.id} listing={listing}/>
                        })}
                    </div>
                </>
            }
            
        </div>
    )
}