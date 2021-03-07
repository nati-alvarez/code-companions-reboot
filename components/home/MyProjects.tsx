import {useForm} from "@hooks/useForm";

//styles
import styles from "@styles/MyProjects.module.scss";

//components
import ProjectCard from "./ProjectCard";
import Modal from "@components/Modal";
import { useState } from "react";
import axios from "axios";

//types
interface Project {
    projectId: number
    title: string
    description: string
    ownerId: number
    ownerUsername: string
    ownerProfilePicture: string | null
}

interface PropTypes {
    projects: Array<Project>,
    setMyProjects: Function,
    JWTToken: string,
    setGlobalSuccessMessage: Function,
    setGlobalErrorMessage: Function
}

export default function MyProjects({projects, setMyProjects, setGlobalErrorMessage, setGlobalSuccessMessage, JWTToken} : PropTypes){
    const [showModal, setShowModal] = useState(false);
    const createProject = async (data) =>{
        try{
            const res = await axios.post("/api/projects", data, {
                headers: {
                    "Authorization": JWTToken
                }
            });
            setGlobalSuccessMessage(res.data.message);
            setMyProjects([...projects, res.data.project]);
            setShowModal(false);
        }catch(err){
            if(err.response){
                setGlobalErrorMessage(err.response.data.message)
            }else setGlobalErrorMessage(err.message);
        }
    };
    const [modalState, onChange, isLoading, setIsLoading, modalError, onSubmit] = useForm({
        fields: [
            {label: "title", name: "title", inputType: "text", validationType: "letters"},
            {label: "description", name: "description", inputType: "textarea", validationType: null},
            {label: "github repo", name: "repo", inputType: "text", validationType: null}
        ], 
        formAction: createProject
    });

    return (
        <div>
            <h3 className={styles["heading"]}>My Projects</h3>
            <button onClick={()=> setShowModal(true)} className={styles["create-project"]}>+ Create New</button>
            {!projects[0] &&
                <p style={{marginTop: "2rem"}}>You aren't a part of any projects. Why not create one or apply to a listing?</p>
            }
            <section className={styles["projects"]}>
                {projects[0] && projects.map(project=>{
                    return (
                        <ProjectCard key={project.projectId} project={project}/>
                    )
                })}
            </section>
            {showModal && <Modal 
                modalState={modalState} 
                modalError={modalError} 
                modalAction={onSubmit as any} 
                onChange={onChange}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setShowModal={setShowModal}
                heading="Create a new project"/>
            }
        </div>
    )
}