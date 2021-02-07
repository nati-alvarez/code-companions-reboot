import {useEffect, useState} from "react";
import axios from "axios";
import octokat from "octokat";
import {serialize} from "cookie";
import {generateAuthToken, generateRefreshToken} from "@helpers/jwt";
import {useRouter} from "next/router";

//atoms
import {useAtom} from "jotai";
import {globalErrorAtom, globalSuccessAtom} from '@atoms/globalMessages';
import {JWTAuthTokenAtom, githubAccessTokenAtom} from "@atoms/auth";

//styles
import styles from "@styles/LoginSignup.module.scss";

//hooks
import Form from "@components/Form";

//components
import Navbar from "@components/Navbar";
import GithubAuthButton from "@components/login-signup/GithubAuthButton";
import { NextPageContext } from "next";
import { useForm } from "@hooks/useForm";

//models
import UsersModel from "@models/Users";


export async function getServerSideProps(context: NextPageContext) {
    const githubAccessCode: string[] | string = context.query.code
    const props: {githubAccessToken? : string, formStartingWith? : string | string[], jwtAuthToken?: string} = {}
    //this will ensure the user is returned to the form they started on after clicking the signup with github button
    if(context.query.state) props.formStartingWith = context.query.state;

    //get the access token once the user comes back from OAuth login
    if(githubAccessCode){
        try {
            const res =  await axios.post(
                "https://github.com/login/oauth/access_token",
                {
                    client_id: process.env.GITHUB_CLIENT_ID,
                    client_secret: process.env.GITHUB_CLIENT_SECRET,
                    code: githubAccessCode,
                },
                {headers: {"Accept": "application/json"}}
            )
            const githubAccessToken = res.data.access_token ? res.data.access_token: null;
            props.githubAccessToken = githubAccessToken;
        }catch(err){
            console.log(err);
        }
    }
    if(props.githubAccessToken && props.formStartingWith === "login"){
        //gets user github info with accessToken
        const user = octokat({token: props.githubAccessToken});
        const userGithubData = await user.me.read();
        try{
            //generates auth and refresh jwt if login valid
            const userPayload = await UsersModel.getUserLogin(null, null, userGithubData.id);
            const refreshToken = generateRefreshToken(userPayload);
            const authToken = generateAuthToken(userPayload);
            const today = new Date();
            const cookieExpiryDate = today.setDate(today.getDate() + 2);
            context.res.setHeader(
                "Set-Cookie",
                serialize("rt", refreshToken, {
                    httpOnly: true,
                    expires: new Date(cookieExpiryDate),
                    maxAge:  60 * 60 * 24 * 2,
                    path: "/",
                    secure: process.env.NODE_ENV === "production"
                })
            );
            //jwt will be passed to component in props, from there update atom state and 
            //JWTWrapper component will handle redirect
            props.jwtAuthToken = authToken;
        }catch(err){
            console.log(err.message);
        }
    }
    return {
        props
    }
}

interface PropTypes {
    githubAccessToken? : string
    formStartingWith? : "login" | "signup",
    jwtAuthToken? : string
}

export default function LoginSignup({githubAccessToken, formStartingWith, jwtAuthToken}: PropTypes){
    const router = useRouter();
    const [globalError, setGlobalError] = useAtom(globalErrorAtom);
    const [globalSuccess, setGlobalSuccess] = useAtom(globalSuccessAtom);
    const [form, setForm] = useState<string>(formStartingWith? formStartingWith: "signup")
    //putting this prop in state so it can be cleared
    //we want to clear it in the event the user swaps forms.
    const [githubAccessTokenState, setGithubAccessTokenState] = useState<string>(githubAccessToken);
    const [JWTAuthToken, setJWTAuthToken] = useAtom(JWTAuthTokenAtom);
    //TODO: find better names for all these versions of githubAccessToken state
    //actual atom available to all components
    const [gitAccessToken, setGithubAccessTokenAtom] = useAtom(githubAccessTokenAtom);

    //login function when users enters in via form rather than github button
    const loginAction = async (data) => {
        try{
            const res = await axios.post("/api/login", data);
        }catch(err){
            console.log(err);
        }finally {
            setLoginIsLoading(false);
        }
    }

    const signupAction = async (data) =>{
        try{
            //gets githubId if user connected github acc before signup
            //will be passed to api/signup endpoint
            if(githubAccessTokenState){
                const githubAPI = octokat({token: githubAccessTokenState});
                const userGithubData = await githubAPI.me.read();
                data.githubId = userGithubData.id;
            }
            const res = await axios.post("/api/signup", data);
            setGlobalSuccess(res.data.message);
        }catch(err){
            setGlobalError(err.response.data.message);
        }finally {
            setSignupIsLoading(false);
        }
    }
    const [loginFormState, onLoginChange, loginIsLoading, setLoginIsLoading, loginFormError, onLoginSubmit] = useForm({
        fields: [ 
            {label: "email", name: "email", inputType: "text", validationType: "email"},
            {label: "password", name: "password", inputType: "password", validationType: "password"}
        ], 
        formAction: loginAction
    });
    const [signupFormState, onSignupChange, signupIsLoading, setSignupIsLoading, signupformError, onSignupSubmit] = useForm({
        fields: [
            {label: "email", name: "email", inputType: "text", validationType: "email"},
            {label: "username", name: "username", inputType: "text", validationType: "no-spaces"},
            {label: "password", name: "password", inputType: "password", validationType: "password"}
        ], 
        formAction: signupAction
    });

    const LoginForm = <Form 
        heading="Login"
        formState={loginFormState}
        isLoading={loginIsLoading}
        formError={loginFormError}
        buttonText="Login" 
        action={onLoginSubmit}
        onChange={onLoginChange}
    />
    const SignupForm = <Form
        heading="Signup"
        formState={signupFormState}
        isLoading={signupIsLoading}
        formError={signupformError}
        buttonText="Signup"
        action={onSignupSubmit}
        onChange={onSignupChange}
    />
    
    function swapForm(form: string): void{
        setForm(form);
        setGithubAccessTokenState(null);
    }

    useEffect(()=>{
        //will update state atoms if jwtAuthToken is in props which it will when user clicks github login button
        //basically handles user login when user clicks "login with github button"
        if(jwtAuthToken) {
            setGithubAccessTokenAtom(githubAccessTokenState);
            setJWTAuthToken(jwtAuthToken);
        }
    }, [jwtAuthToken])

    return (
        <div>
            <Navbar/>
            <main className={styles.main}>
                <p className={styles.prompt}>Welcome! Please login or sign up to get started</p>
                <div className={styles["form-container"]}>
                    {githubAccessTokenState  && formStartingWith === "signup" &&
                        <div className={styles['form-success']}>
                            Success! Your Github account connected. Continue to fill out the form below.
                        </div>
                    }
                    <div className={styles["form-tabs"]}>
                        <button className={form === "login"? styles.active: ""} onClick={()=> swapForm("login")}data-testid="login-tab">
                            Login
                        </button>
                        <button className={form === "signup"? styles.active: ""} onClick={()=> swapForm("signup")} data-testid="signup-tab">
                            Signup
                        </button>
                    </div>
                    {form === "login" && LoginForm}
                    {form === "signup" && SignupForm}
                    <div className={styles["github-auth"]}>
                    {form === "login"?
                            <GithubAuthButton redirectState="login" buttonText="Login with Github"/>
                        :
                            <GithubAuthButton redirectState="signup" buttonText="Connect Github Account"/>
                    }
                    </div>
                </div>
            </main>
        </div>
    )
}