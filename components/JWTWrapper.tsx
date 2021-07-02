import { useEffect, useRef, useState } from "react";
import {useRouter} from "next/router";
import jwt from "jsonwebtoken";
import axios from "axios";

//atoms
import {useAtom} from "jotai";
import {JWTAuthTokenAtom} from "@atoms/auth";

//components
import LoadingPage from "@components/LoadingPage";

/* This component wraps the main app to keep track of the short-lived auth JWT stored in memory
 * and update it bofore it expires using a longer lived refresh token stored in a same site, http
 * only cookie. This strategy (Refresh/Auth Token) gives a much more secure way of storing client side auth tokens
 * than a normal cookie or local storage (See this to learn more: https://medium.com/@sugandhasaxena1212/access-token-and-refresh-token-with-node-js-a501e1cc034b)
 */
export default function JWTWrapper({children} : {children: React.ReactChild}){
    const [JWTAuthToken, setJWTAuthToken] = useAtom(JWTAuthTokenAtom);
    const refreshTokenInterval = useRef<any>();
    const router = useRouter();
    const restrictedRoutes = ["/home", "/profile", "/projects/[id]"];
    //the hasPageLoaded state will be used to ensure initial check for JWT on component mount is finished
    //before running the check on router path change. The check for router path change runs on
    //page load for some reason and causes an unecessary "double refresh"
    const [hasPageLoaded, setHasPageLoaded] = useState(false);

    async function getNewAuthToken(){
        return axios.post("/api/refresh-token", {}, {withCredentials: true}).then(res=>{
            setJWTAuthToken(res.data.token);
            if(router.pathname === "/login-signup") router.replace("/home");
        }).catch(err=>{
            //cookie expired, redirects home
            console.log(err.response.data.message);
            console.log("token, expired. redirecting...");
            if(restrictedRoutes.includes(router.pathname)) router.replace("/login-signup");
            setJWTAuthToken("");
        });
    }
    
    //gets token on page/window refresh
    useEffect(()=>{
        getNewAuthToken().finally(()=>{
            setHasPageLoaded(true)
        });
    }, []);

    //checks if protected routes should be loaded or redirected 
    useEffect(()=>{
        if(hasPageLoaded){
            if(router.pathname === "/login-signup" && JWTAuthToken) router.replace("/home");
            if(restrictedRoutes.includes(router.pathname) && !JWTAuthToken) router.replace("/login-signup");
        }
    }, [router.pathname]);

    useEffect(()=>{
        if(JWTAuthToken){
            //redirects on initial login
            if(router.pathname === "/login-signup") router.replace("/home");
            const {exp, iat} = jwt.decode(JWTAuthToken);
            //sets interval to refresh token once token exprires
            refreshTokenInterval.current = setInterval(()=>{
                getNewAuthToken();
            }, (exp - iat) * 1000);
        }
        return ()=> clearInterval(refreshTokenInterval.current);
    }, [JWTAuthToken]);

    const component = restrictedRoutes.includes(router.pathname) && !JWTAuthToken? <LoadingPage/>: children;
    return(
        <>
            {component}
        </>
    )
}