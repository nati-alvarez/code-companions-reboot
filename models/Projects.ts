import db from "./db";

interface ProjectData {
    ownerId: number,
    title: string,
    description: string,
    github_repo: string | null
}

export default abstract class Projects {
    static async createProject(projectData : ProjectData){
        const projectTitleTaken = await this.projectExists(projectData.title, projectData.ownerId);
        if(projectTitleTaken) throw new Error("Project already exists, choose a new name");

        //the knex/postgres 'returning' method always encapsulates query in an array
        const newProjectId = await db("Projects")
        .insert({
            ownerId: projectData.ownerId,
            title: projectData.title,
            description: projectData.description,
            repoName: projectData.github_repo
        })
        .returning("id");
        return this.getProjectById(newProjectId[0]);
    }

    static getUserProjects(userId: number){
        return db("Projects as p")
        .leftJoin("Users as u", "u.id", 'p.ownerId')
        .where({ownerId: userId})
        .orderBy("p.id")
        .select("p.id as projectId", "p.title", "p.description", "u.id as ownerId", "u.username as ownerUsername", "u.profilePicture as ownerProfilePicture");
    }

    static getProjectById(projectId: number){
        return db("Projects as p")
        .leftJoin("Users as u", "u.id", "p.ownerId")
        .where({"p.id": projectId})
        .select("p.id as projectId", "p.title", "p.description", "u.id as ownerId", "u.username as ownerUsername", "u.profilePicture as ownerProfilePicture")
        .first();
    }

    static async projectExists(title : string, ownerId : number) : Promise<object>{
        return db("Projects").where({title, ownerId}).first();
    }
}