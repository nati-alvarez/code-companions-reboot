//styles
import styles from "@styles/MyProjects.module.scss";

//components
import ProjectCard from "./ProjectCard";

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
    return (
        <div>
            <h3 className={styles["heading"]}>My Projects</h3>
            <button className={styles["create-project"]}>+ Create New</button>
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
        </div>
    )
}