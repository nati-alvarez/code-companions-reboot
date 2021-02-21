import { useEffect, useState } from "react";
import axios from "axios";

//styles
import styles from "@styles/Home.module.scss";

//atoms 
import { JWTAuthTokenAtom } from "@atoms/auth";
import {globalErrorAtom, globalSuccessAtom} from "@atoms/globalMessages";
import {useAtom} from "jotai";

interface Project {
    projectId: number
    title: string
    description: string
    ownerId: number
    ownerUsername: string
    ownerProfilePicture: string | null
}

//components
import Navbar from "@components/Navbar";
import MyProjects from "@components/home/MyProjects";
import ProjectListings from "@components/home/ProjectListings";
import LoadingAnimation from "@components/LoadingAnimation";

export default function Home(){
    const [JWTToken, setJWTToken] = useAtom(JWTAuthTokenAtom);
    const [globalSuccessMessage, setGlobalSuccessMessage] = useAtom(globalSuccessAtom);
    const [globalErrorMessage, setGlobalErrorMessage] = useAtom(globalErrorAtom);

    const [tab, setTab] = useState("projects");
    const [myProjectsLoading, setMyProjectsLoading] = useState(false);
    const [myProjects, setMyProjects] = useState<Array<Project>>([]);
    const [projectListings, setProjectListings] = useState<Array<object>>([]);

    useEffect(()=>{
        setMyProjectsLoading(true);
        axios.get("/api/projects", {headers: {
            "Authorization": JWTToken
        }}).then(res=>{
            setMyProjects(res.data.projects); 
        }).catch(err=>{
            console.log(err.response.data.message);
        }).finally(()=>{
            setMyProjectsLoading(false);
        })
    }, []);

    return (
        <div>
            <Navbar/>
            <main className={styles["main"]}>
            <div className={styles["dash-tabs"]}>
                <div onClick={()=> setTab("projects")} 
                className={tab == "projects"? `${styles['dash-tab']} ${styles['active']}` :styles["dash-tab"]}>
                    My Projects
                </div>
                <div onClick={()=> setTab("listings")}
                className={tab == "listings"? `${styles['dash-tab']} ${styles['active']}` :styles["dash-tab"]}>
                    Project Listings
                </div>
            </div>
            <div className={styles["dash-container"]}>
                {tab === "projects"?
                    myProjectsLoading?
                        <LoadingAnimation/>
                    :
                        <MyProjects 
                            setGlobalErrorMessage={setGlobalErrorMessage}
                            setGlobalSuccessMessage={setGlobalSuccessMessage}
                            JWTToken={JWTToken}
                            setMyProjects={setMyProjects}
                            projects={myProjects}/>
                    
                :
                    <ProjectListings 
                        setGlobalErrorMessage={setGlobalErrorMessage} 
                        setGlobalSuccessMessage={setGlobalSuccessMessage} 
                        listings={projectListings}/>
                }
            </div>
            </main>
        </div>
    )
}