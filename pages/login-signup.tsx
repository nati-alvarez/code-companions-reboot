import {useState} from "react";

//styles
import styles from "@styles/LoginSignup.module.scss";

//hooks
import Form from "@components/Form";

//components
import Navbar from "@components/Navbar";

export default function LoginSignup(){
    const LoginForm = <Form 
        heading="Login"
        fields={[
            {label: "email", name: "email", inputType: "text", validationType: "email"},
            {label: "password", name: "password", inputType: "password", validationType: "password"}
        ]} 
        buttonText="Login" 
        action={(fieldState)=>console.log(fieldState)}
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
    const [form, setForm] = useState<string>("signup")
    
    return (
        <div>
            <Navbar/>
            <main className={styles.main}>
                <p className={styles.prompt}>Welcome! Please login or sign up to get started</p>
                <div className={styles["form-container"]}>
                    <div className={styles["form-tabs"]}>
                        <button className={form === "login"? styles.active: ""} onClick={()=> setForm("login")}data-testid="login-tab">
                            Login
                        </button>
                        <button className={form === "signup"? styles.active: ""} onClick={()=> setForm("signup")} data-testid="signup-tab">
                            Signup
                        </button>
                    </div>
                    {form == "login" && LoginForm}
                    {form == "signup" && SignupForm}
                </div>
            </main>
        </div>
    )
}