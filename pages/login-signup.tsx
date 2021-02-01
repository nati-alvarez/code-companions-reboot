import {useState} from "react";
import axios from "axios";

//styles
import styles from "@styles/LoginSignup.module.scss";

//hooks
import Form from "@components/Form";

//components
import Navbar from "@components/Navbar";
import GithubAuthButton from "@components/login-signup/GithubAuthButton";
import { NextPageContext } from "next";


export async function getServerSideProps(context: NextPageContext) {
    const githubAccessCode: string[] | string = context.query.code
    const props: {githubAccessToken? : string, formStartingWith? : string | string[]} = {}
    if(context.query.state) props.formStartingWith = context.query.state;

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
            console.log(err)
        }
    }
    return {
        props
    }
}


export default function LoginSignup({githubAccessToken, formStartingWith}){
    const [form, setForm] = useState<string>(formStartingWith? formStartingWith: "signup")
    //putting this prop in state so it can be cleared
    //we want to clear it in the event the user swaps forms.
    const [githubAccessTokenState, setGithubAccessTokenState] = useState<string>(githubAccessToken);

    const loginAction = async (data) => {
        const res = await axios.post("/api/login", data);
        console.log(res);
    }

    const LoginForm = <Form 
        heading="Login"
        fields={[
            {label: "email", name: "email", inputType: "text", validationType: "email"},
            {label: "password", name: "password", inputType: "password", validationType: "password"}
        ]} 
        buttonText="Login" 
        action={loginAction}
    />
    const SignupForm = <Form
        heading="Signup"
        fields={[
            {label: "email", name: "email", inputType: "text", validationType: "email"},
            {label: "username", name: "username", inputType: "text", validationType: "no-spaces"},
            {label: "password", name: "password", inputType: "password", validationType: "password"}
        ]}
        buttonText="Signup"
        action={(fieldState)=>{
            console.log(fieldState)
        }}
    />
    
    function swapForm(form: string): void{
        setForm(form);
        setGithubAccessTokenState(null);
    }

    return (
        <div>
            <Navbar/>
            <main className={styles.main}>
                <p className={styles.prompt}>Welcome! Please login or sign up to get started</p>
                <div className={styles["form-container"]}>
                    {githubAccessTokenState &&
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