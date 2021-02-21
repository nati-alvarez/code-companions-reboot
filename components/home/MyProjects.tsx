import {useForm} from "@hooks/useForm";

//styles
import styles from "@styles/MyProjects.module.scss";

//components
import ProjectCard from "./ProjectCard";
import Modal from "@components/Modal";
import { useState } from "react";

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
    projects: Array<Project>
}

export default function MyProjects({projects} : PropTypes){
    const createProject = (data) => console.log(data);
    const [modalState, onChange, isLoading, setIsLoading, modalError, onSubmit] = useForm({
        fields: [
            {label: "title", name: "title", inputType: "text", validationType: "letters"},
            {label: "description", name: "description", inputType: "textarea", validationType: null},
            {label: "github repo", name: "repo", inputType: "text", validationType: "no-spaces"}
        ], 
        formAction: createProject
    });
    const [showModal, setShowModal] = useState(false);

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