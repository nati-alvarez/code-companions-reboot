//styles
import styles from "@styles/MyProjects.module.scss";

//types
interface Project {
    projectId: number
    title: string
    description: string
    ownerId: number
    ownerUsername: string
    ownerProfilePicture: string | null
}

export default function ProjectCard({project}: {project: Project}){
    return (
        <div className={styles["project-card"]}>
           <h4>{project.title}</h4>
           <div className={styles["project-owner"]}>
               <img height="35" width="35" src={project.ownerProfilePicture? project.ownerProfilePicture: "/logo-m.png"}/>
               <p>{project.ownerUsername}</p>
           </div>
           <p className={styles["description"]}>{project.description}</p>
           <button className={styles["workspace-button"]}>Open Workspace</button>
        </div>
    )
}