import jwt from "jsonwebtoken";
import axios from "axios";
import cookie from "cookie";

//atoms
import {useAtom} from "jotai";
import {JWTAuthTokenAtom} from "@atoms/auth";
import React, { useEffect, useState } from "react";

//hooks
import {useForm} from "@hooks/useForm";

//styles
import styles from "@styles/Profile.module.scss";

//components
import LoadingAnimation from "@components/LoadingAnimation";
import Navbar from "@components/Navbar";
import Modal from "@components/Modal";

//icons
import {FaPen, FaUser} from "react-icons/fa";

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

export default function Profile(props){
    const [JWTToken, setJWTToken] = useAtom(JWTAuthTokenAtom);
    const [user, setUser] = useState<UserData>(props.userData);
    const tokenInfo = jwt.decode(JWTToken);

    const [infoModalState, onInfoChange, infoIsLoading, setinfoIsLoading, infoModalError, onInfoSubmit] = useForm({
        fields: [
            {label: "Profile Picture", name: "pfp", inputType: "text", validationType: null, value: user.profilePicture},
            {label: "Username", name: "username", inputType: "text", validationType: null, value: user.username},
            {label: "Name", name: "name", inputType: "text", validationType: null, value: user.name},
            {label: "Title", name: "title", inputType: "text", validationType: null, value: user.title},
            {label: "About", name: "about", inputType: "text", validationType: null, value: user.about}
        ], 
        formAction: updateUserInfo
    });
    const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

    function updateUserInfo(){
        console.log("running function")
        console.log(infoModalError, infoModalState);
    }

    const skills = ['JavaScript', "HTML", "CSS", "React"];
    const links = ["http://github.com/nati-alvarez", "http://natividadalvarez.vercel.app", "http://linkedin.com/in/natividad-alvarez"];
    return (
        <div>
            <Navbar/>
            {showInfoModal && 
                <Modal 
                setShowModal={()=>setShowInfoModal(!showInfoModal)} 
                heading="Edit Your Account Info" 
                modalError={infoModalError}
                modalState={infoModalState}
                />
            }
            <main className={styles["profile-page"]}>
                <button className={styles["logout-button"]}>Logout</button>
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
                        <section className={styles["skills"]}>
                            <h4>{user.username}'s Skills</h4>
                            <div className={styles["edit-button"]}>
                                <FaPen/>
                            </div>
                            {user.skills[0] && user.skills.map(skill=>{
                                return (
                                    <div className={styles["skill-tag"]}>
                                        {skill}
                                    </div>
                                )
                            })}
                            {!user.skills[0] && <p>You haven't added any skills.</p>}
                        </section>
                        <section className={styles["links"]}> 
                            <div className={styles["edit-button"]}>
                                <FaPen/>
                            </div>
                            <h4>Social Links</h4>
                            <div>
                                {user.links[0] && user.links.map(link=>{
                                    return (
                                        <a href={link}>{link}</a>
                                    )
                                })}
                                {!user.links[0] && <p>You haven't added any profile links.</p>}
                            </div>
                        </section>
                    </React.Fragment>
                }
                {!user &&
                    <LoadingAnimation/>
                }
            </main>
        </div>
    )
}