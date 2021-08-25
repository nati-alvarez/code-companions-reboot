import jwt from "jsonwebtoken";
import axios from "axios";
import cookie from "cookie";
import {useRouter} from "next/router";

//atoms
import {useAtom} from "jotai";
import {JWTAuthTokenAtom} from "@atoms/auth";
import {globalSuccessAtom} from "@atoms/globalMessages"
import React, { useState } from "react";

//hooks
import {useForm} from "@hooks/useForm";

//styles
import styles from "@styles/Profile.module.scss";

//components
import LoadingAnimation from "@components/LoadingAnimation";
import Navbar from "@components/Navbar";
import Modal from "@components/Modal";
import Skills from "@components/profile/Skills";
import Links from "@components/profile/Links";

//icons
import {FaPen} from "react-icons/fa";

//types
interface UserData {
    id: number,
    email: string,
    username: string,
    name: string,
    profilePicture: string,
    joinedOn: string,
    title: string,
    about: string,
    skills: Array<string>
    links: Array<string>
}

//models
import UsersModel from "@models/Users";

export async function getServerSideProps(context){
    if(context.req.headers.cookie){
        const refreshToken = cookie.parse(context.req.headers.cookie).rt;
        const user = jwt.decode(refreshToken);
        const userData = await UsersModel.getMyProfile(user.id);
        
        //this is required, otherwise passing this through server side props will throw a JSON serialization error
        userData.joinedOn = userData.joinedOn.toISOString();
        
        return {
            props: {
                userData
            }
        };
    }
    return {props: {}};
}

export default function Profile(props){
    const router = useRouter();
    const [JWTToken, setJWTToken] = useAtom(JWTAuthTokenAtom);
    const [user, setUser] = useState<UserData>(props.userData);
    const [globalSuccessMessage, setGlobalSuccessMessage] = useAtom(globalSuccessAtom);

    const [infoModalState, onInfoChange, infoIsLoading, setInfoIsLoading, infoModalError, setInfoModalError, onInfoSubmit] = useForm({
        fields: [
            {label: "Profile Picture", name: "pfp", inputType: "text", validationType: null, value: user.profilePicture},
            {label: "Username", name: "username", inputType: "text", validationType: "no-spaces", value: user.username},
            {label: "Name", name: "name", inputType: "text", validationType: "letters", value: user.name},
            {label: "Title", name: "title", inputType: "text", validationType: null, value: user.title},
            {label: "About", name: "about", inputType: "textarea", validationType: null, value: user.about}
        ], 
        formAction: updateUserInfo
    });
    const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

    async function updateUserInfo(data){
        setInfoIsLoading(true);
        try{
            await axios.put(`/api/users/${user.id}`, data, {
                headers: {
                    "Authorization": JWTToken
                }
            });
            setUser({
                ...user,
                ...data
            });
            setGlobalSuccessMessage("You profile was updated");
            setShowInfoModal(false);
        }catch(err){
            if(err.response.data) console.log(err.response.data.message);
            setInfoModalError({
                inputId: null,
                message: err.response.data.message
            });
        }finally{
            setInfoIsLoading(false);
        }
    }

    async function logout() {
        await axios.get("/api/logout", {
            headers: {
            "Authorization": JWTToken
            }
        });
        setJWTToken("");
        router.replace("/");
    }

    return (
        <div>
            <Navbar/>
            {showInfoModal && 
                <Modal 
                    setShowModal={()=>setShowInfoModal(!showInfoModal)} 
                    heading="Edit Your Account Info" 
                    modalError={infoModalError}
                    setModalError={setInfoModalError}
                    modalState={infoModalState}
                    modalAction={onInfoSubmit as any}
                    onChange={onInfoChange}
                    isLoading={infoIsLoading}
                    setIsLoading={setInfoIsLoading}
                />
            }
            <main className={styles["profile-page"]}>
                <button onClick={logout} className={styles["logout-button"]}>Logout</button>
                {user &&
                    <React.Fragment>
                        <section className={styles["user-info"]}>
                            <div onClick={()=>setShowInfoModal(true)} className={styles["edit-button"]}>
                                <FaPen/>
                            </div>
                            <img className={styles["pfp"]} src={user.profilePicture}/>
                            <div className={styles["handles"]}>
                                <span className={styles["username"]}>@{user.username}</span>
                                <span className={styles["name"]}>{user.name}</span>
                            </div>
                            <p className={styles["title"]}>{user.title}</p>
                            <div className={styles["about"]}>
                                <h4>About Me</h4>
                                <p>{user.about}</p>
                            </div>
                        </section>
                        <Skills user={user} setUser={setUser} JWTToken={JWTToken}/>
                        <Links user={user} setUser={setUser} JWTToken={JWTToken}/>
                    </React.Fragment>
                }
                {!user &&
                    <LoadingAnimation/>
                }
            </main>
        </div>
    )
}