import {useState, useRef} from "react";
import axios from "axios";

//styles
import styles from "@styles/Profile.module.scss";

//icons
import {FaPen, FaSave, FaTrashAlt} from "react-icons/fa";

//components
import LoadingAnimation from "@components/LoadingAnimation";

export default function Skills({user, setUser, JWTToken}){
    const [skillQuery, setSkillQuery] = useState<string>("");
    const [skillSuggestions, setSkillSuggestions] = useState<Array<Object>>([]);
    const [skillSuggestionsLoading, setSkillSuggestionsLoading] = useState<boolean>(false);
    const [showSkillSelect, setShowSkillSelect] = useState<boolean>(false);
    const [skillUpdates, setSkillUpdates] = useState<Array<string>>(user.skills);
    const skillQueryTimeout = useRef<any>();
    

    function updateSkillQuery(e) {
        setSkillQuery(e.target.value)
        clearTimeout(skillQueryTimeout.current);
        skillQueryTimeout.current = setTimeout(()=> skillQueryTimeoutFunction(e.target.value), 500);
    }

    function skillQueryTimeoutFunction(query){
        setSkillSuggestions([]);
        if(!query) return;
        setSkillSuggestionsLoading(true);

        axios.post('/api/skills-api', {query}, {
            headers: {
                "Authorization": JWTToken
            }
        }).then(res=>{
            setSkillSuggestions(res.data);
        }).catch(err=>{
            console.log(err);
        }).finally(() => setSkillSuggestionsLoading(false));
    }
    
    async function updateUserSkills(skillData){
        // e (event) will only be defined when this is called by an input. 
        // This will happen only when adding custom skill tags
        if(skillData.e && skillData.e.keyCode === 13){
            setSkillQuery("");
            skillData.skillName = skillData.e.target.value;
        }else if (skillData.e) return;
        
        if(skillData.action === "add" && !skillUpdates.includes(skillData.skillName)){
           setSkillUpdates([...skillUpdates, skillData.skillName]);
        }else if(skillData.action === "remove") {
            setSkillUpdates(skillUpdates.filter(skill => skill != skillData.skillName))
        }
    }

    function discardChanges(){
        setSkillQuery("");
        setSkillUpdates(user.skills);
        setShowSkillSelect(false);
    }

    async function saveUserSkills(){
        const data = {skills: []};
        skillUpdates.forEach(skillName => {
            data.skills.push({
                skillName,
                userId: user.id

            });
        });
        try{
            await axios.put(`/api/users/${user.id}`, data, {
                headers: {
                    "Authorization": JWTToken
                }
            });
            setSkillQuery("");
            setUser({
                ...user,
                skills: skillUpdates
            });
            setShowSkillSelect(false);
        }catch(err){
            console.log(err.response.data.message);
        }
    }

    return (
        <section className={styles["skills"]}>
            <h4>{user.name? user.name : user.username}'s Skills</h4>
            {!showSkillSelect && 
                <div onClick={()=>setShowSkillSelect(!showSkillSelect)} className={styles["edit-button"]}>
                    <FaPen/>
                </div>
            }
            {showSkillSelect && 
                <>
                    <div onClick={saveUserSkills} className={styles["save-button"]}>
                        <FaSave/>
                    </div>
                    <div onClick={discardChanges} className={styles["discard-button"]}>
                        <FaTrashAlt/>
                    </div>
                </>
            }

            {!showSkillSelect && user.skills[0] && user.skills.map(skill=>{
                return (
                    <div className={styles["skill-tag"]}>
                        {skill}
                    </div>
                )
            })}
            {showSkillSelect && skillUpdates.map(skill=>{
                return (
                    <div className={`${styles["skill-tag"]} ${styles["skill-tag-removable"]}`} onClick={()=> updateUserSkills({action: "remove", skillName: skill})}>
                        {skill}
                    </div>
                )
            })}

            {!user.skills[0] && !skillUpdates[0] && <p>You haven't added any skills.</p>}
            {showSkillSelect && <div className={styles["skill-select"]}>
                <input onKeyUp={e=> updateUserSkills({action: "add", e})} onChange={updateSkillQuery} value={skillQuery} type="text"/>
                <div className={styles["suggestions"]}>
                    {skillSuggestions.map(suggestion=>{
                        return (
                            <div onClick={()=> updateUserSkills({action: "add", skillName: suggestion.keyName})} className={styles["suggestion"]}>{suggestion.keyName}</div>
                        );
                    })}
                    {skillSuggestionsLoading && <LoadingAnimation/>}
                </div>
            </div>}
        </section>
    )
}