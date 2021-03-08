import jwt from "jsonwebtoken";
import axios from "axios";

//atoms
import {useAtom} from "jotai";
import {JWTAuthTokenAtom} from "@atoms/auth";
import React, { useEffect, useState } from "react";

//styles
import styles from "@styles/Profile.module.scss";

//components
import LoadingAnimation from "@components/LoadingAnimation";
import Navbar from "@components/Navbar";

//types
interface UserData {
    id: number,
    email: string,
    username: string,
    name: string,
    profilePicture: string,
    joinedOn: string,
    title: string,
    about: string
}

export default function Profile(){
    const [JWTToken, setJWTToken] = useAtom(JWTAuthTokenAtom);
    const [user, setUser] = useState<UserData>();
    const tokenInfo = jwt.decode(JWTToken);

    useEffect(()=>{
        axios.get(`/api/users/${tokenInfo.id}`, {
            headers: {
                "Authorization": JWTToken
            }
        }).then(res=>{
            setUser(res.data.user)
        }).catch(err=>{
            console.log(err.response.data.message)
        })
    }, []);

    const skills = ['JavaScript', "HTML", "CSS", "React"];
    const links = ["http://github.com/nati-alvarez", "http://natividadalvarez.vercel.app", "http://linkedin.com/in/natividad-alvarez"];
    return (
        <div>
            <Navbar/>
            <main className={styles["profile-page"]}>
                <button className={styles["logout-button"]}>Logout</button>
                {user &&
                    <React.Fragment>
                        <img className={styles["pfp"]} src={user.profilePicture}/>
                        <div className={styles["handles"]}>
                            <span className={styles["username"]}>@{user.username}</span>
                            <span className={styles["name"]}>{user.name}</span>
                        </div>
                        <p className={styles["title"]}>{user.title}</p>
                        <section className={styles["about"]}>
                            <h4>About Me</h4>
                            <p>{user.about}</p>
                        </section>
                        <section className={styles["skills"]}>
                            <h4>{user.name}'s Skills</h4>
                            {skills.map(skill=>{
                                return (
                                    <div className={styles["skill-tag"]}>
                                        {skill}
                                    </div>
                                )
                            })}
                        </section>
                        <section className={styles["links"]}> 
                            <h4>Social Links</h4>
                            <div>
                                {links.map(link=>{
                                    return (
                                        <a href={link}>{link}</a>
                                    )
                                })}
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