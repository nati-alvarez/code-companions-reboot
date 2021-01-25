import {useState} from "react";

//styles
import styles from "@styles/LoginSignup.module.scss";

//hooks
import {useForm} from "@hooks/useForm";

//components
import Navbar from "@components/Navbar";

export default function LoginSignup(){
    const LoginForm = useForm({
        heading: "Login",
        fields: [
            {name: "email", inputType: "text"},
            {name: "password", inputType: "password"}
        ],
        buttonText: "Login",
        action: (fieldState)=>{
            console.log(fieldState)
        }
    });
    const SignupForm = useForm({
        heading: "Signup",
        fields: [
            {name: "email", inputType: "text"},
            {name: "username", inputType: "text"},
            {name: "password", inputType: "password"}
        ],
        buttonText: "Signup",
        action: (fieldState)=>{
            console.log(fieldState)
        }
    })
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
                    {form === "signup"? SignupForm: LoginForm}
                </div>
            </main>
        </div>
    )
}