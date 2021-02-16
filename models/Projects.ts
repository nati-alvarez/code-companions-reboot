import db from "./db";

interface ProjectData {
    ownerId: number,
    title: string,
    description: string,
    repoName: string | null
}

export default abstract class Projects {
    static async createProject(projectData : ProjectData){
        if(this.projectExists(projectData.title, projectData.ownerId)) throw new Error("Project already exists, choose a new name");
        return db("Projects")
        .insert(projectData)
        .returning("id, title, description");
    }

    static getUserProjects(userId: number){
        return db("Projects as p")
        .leftJoin("Users as u", "u.id", 'p.ownerId')
        .where({ownerId: userId})
        .select("p.id as projectId", "p.title", "p.description", "u.id as ownerId", "u.username as ownerUsername", "u.profilePicture as ownerProfilePicture");
    }

    static async projectExists(title : string, ownerId : number){
        db("Projects").where({title, ownerId}).first();
    }
}