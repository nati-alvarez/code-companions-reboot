import { useEffect, useRef } from "react";
import {useRouter} from "next/router";
import jwt from "jsonwebtoken";
import axios from "axios";

//atoms
import {useAtom} from "jotai";
import {JWTAuthTokenAtom} from "@atoms/auth";

export default function JWTWrapper({children} : {children: React.ReactChild}){
    const [JWTAuthToken, setJWTAuthToken] = useAtom(JWTAuthTokenAtom);
    const refreshTokenInterval = useRef<any>();
    const router = useRouter();
    const restrictedRoutes = ["/home"];

    async function getNewAuthToken(){
        return axios.post("/api/refresh-token", {}, {withCredentials: true});
    }
    
    useEffect(()=>{
        if(router.pathname === "/login-signup" && JWTAuthToken) router.replace("/home");
        if(restrictedRoutes.includes(router.pathname) && !JWTAuthToken) router.replace("/login-signup");
    }, [router.pathname])

    useEffect(()=>{
        if(JWTAuthToken){
            //redirects on initial login
            if(router.pathname === "/login-signup") router.replace("/home");
            const {exp, iat} = jwt.decode(JWTAuthToken);
            //sets interval to refresh token once token exprires
            refreshTokenInterval.current = setInterval(()=>{
                getNewAuthToken().then(res=>{
                    console.log("auth token refreshed after expiry")
                    setJWTAuthToken(res.data.token)
                    if(router.pathname === "/login-signup") router.replace("/home");
                }).catch(err=>{
                    //cookie expired, redirects home
                    if(restrictedRoutes.includes(router.pathname)) router.replace("/login-signup");
                    setJWTAuthToken("")
                });
            }, (exp - iat) * 1000);
        }else {
            //on refresh, attempts to refresh token with cookie
            getNewAuthToken().then(res=>{
                setJWTAuthToken(res.data.token);
                if(router.pathname === "/login-signup") router.replace("/home");
            }).catch(err=>{
                    //cookie expired, redirects home
                    console.log(err.response.data.message);
                    console.log("token, expired. redirecting...");
                    router.replace("/login-signup");
                });
        }
        return ()=> clearInterval(refreshTokenInterval.current);
    }, [JWTAuthToken]);

    const component = restrictedRoutes.includes(router.pathname) && !JWTAuthToken? <p>Loading</p>: children;
    return(
        <>
            {component}
        </>
    )
}