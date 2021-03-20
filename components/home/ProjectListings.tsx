import {useEffect, useRef, useState} from "react";
import axios from "axios";

//styles
import styles from "@styles/ProjectListings.module.scss";

//components
import ListingCard from "./ListingCard";
import LoadingAnimation from "@components/LoadingAnimation";

export default function ProjectListings({setGlobalSuccessMessage, setGlobalErrorMessage, JWTToken, setProjectListings, listings}){
    const [loading, setLoading] = useState(true);
    const [totalListings, setTotalListings] = useState(0)
    const [pageNumber, setPageNumber] = useState(1);
    const [listingFilters, setListingFilters] = useState({
        query: "",
        option: "newest",
        listingsPerPage: 10
    });
    useEffect(()=>{
        axios.get(
            "/api/listings", 
            {headers: {
                "Authorization": JWTToken
            }}
        ).then(res=>{
            setTotalListings(res.data.totalListings);
            setProjectListings(res.data.listings);
        }).catch(err=>{
            console.log(err);
        }).finally(()=>{
            setLoading(false);
        })
    }, []);

    //gets all listings without filtering by keyword when keyword is empty
    useEffect(()=>{
        if(listingFilters.query == "") getListings();
    }, [listingFilters.query]);

    const getListings = async () => {
        setLoading(true);
        //null will be passed in as the string "null" so checking here it before adding it to url
        let queryString = `?option=${listingFilters.option}&listingsPerPage=${listingFilters.listingsPerPage}&page=${pageNumber}` 
        queryString += (listingFilters.query)? `&query=${listingFilters.query}`: "";
        try {
            const res = await axios.get(
                `/api/listings${queryString}`,
                {headers: {
                    "Authorization": JWTToken
                }}    
            )
            setTotalListings(res.data.totalListings);
            setProjectListings(res.data.listings)
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }
    
    const updatePageNumber = (page: number) => {
        if(page > totalPages || page < 1) return; //keeps page within the right bounds
        setPageNumber(page);
    }

    useEffect(()=>{
        updatePageNumber(1);
    }, [listingFilters.listingsPerPage]);

    useEffect(()=>{
        //prevents unecessary query
        // if(listingFilters.listingsPerPage > totalListings) return;
        getListings();
    }, [pageNumber, listingFilters.listingsPerPage, listingFilters.option])

    const totalPages = Math.ceil(totalListings / listingFilters.listingsPerPage);
    const paginationButtons = [];
    const countFrom = totalPages - pageNumber <  5? totalPages - 5 > 0? totalPages - 5: 1: pageNumber;
    
    for(let i = countFrom; i <= countFrom + 5; i++){
        if(i > totalPages) break;
        const classes = (i === pageNumber)? `${styles["number-button"]} ${styles["active"]}`: styles["number-button"];
        const pageButton = (
            <button className={classes} onClick={() => updatePageNumber(i)}>
                {i}
            </button>
        )
        paginationButtons.push(pageButton);
    }
   
    return (
        <div>
            <h3>Projects for you:</h3>
            <div className={styles["listings-filters"]}>
                <fieldset>
                    <label htmlFor="order-by">Order by: </label>
                    <select id="order-by" onChange={e => setListingFilters({...listingFilters, option: e.target.value})}>
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                    </select>
                </fieldset>
                <fieldset>
                    <label htmlFor="per-page">Listings per page: </label>
                    <input 
                        id="per-page"
                        type="number" 
                        max={totalListings} min="1"
                        onChange={e => setListingFilters({...listingFilters, listingsPerPage: parseInt(e.target.value)})}
                        value={listingFilters.listingsPerPage}
                    />
                </fieldset>
                <fieldset>
                    <label htmlFor="query">Search by title: </label>
                    <input 
                        id="query" 
                        onKeyUp={(e)=> {if(e.keyCode === 13) getListings()}}
                        onChange={e => setListingFilters({...listingFilters, query: e.target.value})}
                        value={listingFilters.query}
                    />
                </fieldset>
                <button onClick={getListings} className={styles["filter-button"]}>Find</button>
            </div>
            {totalListings / listingFilters.listingsPerPage > 1 &&
                <div className={styles["paginator"]}>
                    {pageNumber !== 1 && <button className={`${styles["page-button"]} ${styles["page-button-next-last"]}`} onClick={()=> updatePageNumber(pageNumber-1)}>Prev</button>}
                    {paginationButtons}
                    {pageNumber !== totalPages && <button className={`${styles["page-button"]} ${styles["page-button-next-last"]}`} onClick={()=> updatePageNumber(pageNumber+1)}>Next</button>}
                </div>
            }
            {loading?
                <LoadingAnimation/>
            :
                <>
                    <div className={styles["listings-container"]}>
                        {listings[0] && listings.map(listing=>{
                            return <ListingCard key={listing.id} listing={listing}/>
                        })}
                        {!listings[0] &&
                            <p>Sorry! Nothing was found :(</p>
                        }
                    </div>
                </>
            }
            
        </div>
    )
}