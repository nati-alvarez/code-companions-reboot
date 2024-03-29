import { useState, useRef } from "react";
import axios from "axios";

// atoms
import { useAtom } from "jotai";
import { globalSuccessAtom } from "@atoms/globalMessages";
import { globalErrorAtom } from "@atoms/globalMessages";

// styles
import styles from "@styles/Profile.module.scss";

// icons
import { FaPen, FaSave, FaTrashAlt } from "react-icons/fa";

// components
import LoadingAnimation from "@components/LoadingAnimation";

// types
interface ISuggestion {
    keyName: string,
    id: string
}

export default function Skills({user, setUser, JWTToken, skillAutocompleteSuggestions}){
    const [skillQuery, setSkillQuery] = useState<string>("");
    const [skillSuggestions, setSkillSuggestions] = useState<Array<Object>>([]);
    const [skillSuggestionsLoading, setSkillSuggestionsLoading] = useState<boolean>(false);
    const [showSkillSelect, setShowSkillSelect] = useState<boolean>(false);
    const [skillUpdates, setSkillUpdates] = useState<Array<string>>(user.skills);
    const skillQueryTimeout = useRef<any>();

    const [globalSuccessMessage, setGlobalSuccessMessage] = useAtom(globalSuccessAtom);
    const [globalErrorMessage, setGlobalErrorMessage] = useAtom(globalErrorAtom);

    

    function updateSkillQuery(e) {
        // soft character limit on skill names
        // TODO: either think about imposing this on the backend as well, or remove altogether
        if(e.target.value.length > 35) return;

        setSkillQuery(e.target.value);
        clearTimeout(skillQueryTimeout.current);
        skillQueryTimeout.current = setTimeout(()=> skillQueryTimeoutFunction(e.target.value), 500);
    }

    function skillQueryTimeoutFunction(query){
        setSkillSuggestions([]);
        if(!query) return;
        setSkillSuggestionsLoading(true);

        const suggestions = [];
        skillAutocompleteSuggestions.every(skill=>{
            const regex = new RegExp(`^${query.toLowerCase()}`);
            if(regex.test(skill.keyName.toLowerCase())) suggestions.push(skill);
            if(suggestions.length === 5) return false;
            return true;
        });
        console.log(suggestions)
        setSkillSuggestions(suggestions);
        setSkillSuggestionsLoading(false);
    }
    
    async function updateUserSkills(skillData){
        // e (event) will only be defined when this is called by an input. 
        // This will happen only when adding custom skill tags
        if(skillData.e && skillData.e.keyCode === 13){
            setSkillQuery("");
            skillData.skillName = skillData.e.target.value;
            setSkillSuggestions([]);
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
            const res = await axios.put(`/api/users/${user.id}`, data, {
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
            setGlobalSuccessMessage(res.data.message);
        }catch(err){
            console.log(err.response.data.message);
            setGlobalErrorMessage(err.response.data.message);
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

            {!showSkillSelect && user.skills[0] && user.skills.map((skill, id)=>{
                return (
                    <div key={id} className={styles["skill-tag"]}>
                        {skill}
                    </div>
                )
            })}
            {showSkillSelect && skillUpdates.map((skill, id)=>{
                return (
                    <div key={id} className={`${styles["skill-tag"]} ${styles["skill-tag-removable"]}`} onClick={()=> updateUserSkills({action: "remove", skillName: skill})}>
                        {skill}
                    </div>
                )
            })}

            {!user.skills[0] && !skillUpdates[0] && <p>You haven't added any skills.</p>}
            {showSkillSelect && 
                <div className={styles["skill-select"]}>
                    <input onKeyUp={e=> updateUserSkills({action: "add", e})} onChange={updateSkillQuery} value={skillQuery} type="text"/>
                    <div className={styles["suggestions"]}>
                        {skillSuggestions.map((suggestion: ISuggestion) =>{
                            return (
                                <div key={suggestion.id} onClick={()=> updateUserSkills({action: "add", skillName: suggestion.keyName})} className={styles["suggestion"]}>{suggestion.keyName}</div>
                            );
                        })}
                        {skillSuggestionsLoading && <LoadingAnimation/>}
                    </div>
                </div>
            }
         </section>
    )
}