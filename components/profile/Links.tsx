import {useState, useRef} from "react";
import axios from "axios";

// atoms
import { useAtom } from "jotai";
import {globalSuccessAtom, globalErrorAtom} from "@atoms/globalMessages"

//icons
import {FaPen, FaSave, FaTrashAlt} from "react-icons/fa";

// styles
import styles from "@styles/Profile.module.scss";

// types
interface IUserLink {
    id: string,
    label: string,
    url: string
}



export default function Links({user, setUser, JWTToken}) {
    const [showEditLinks, setShowEditLinks] = useState<boolean>(false);
    const [linkUpdates, setLinkUpdates] = useState<Array<IUserLink>>(user.links);
    // will be used to uniquely identify new links until they are saved to the db
    const newLinkId= useRef<string>("n-0");

    const [globalSuccessMessage, setGlobalSuccessMessage] = useAtom(globalSuccessAtom);
    const [globalErrorMessage, setGlobalErrorMessage] = useAtom(globalErrorAtom);

    
    function updateLinkLabel (e) {
        const linkId = e.target.dataset.id;
        setLinkUpdates(linkUpdates.map(link => {
            if(link.id == linkId) {
                return {...link, label: e.target.value}
            } else {
                return link;
            }
        }));
    }

    function updateLinkUrl (e) {
        const linkId = e.target.dataset.id;
        setLinkUpdates(linkUpdates.map(link => {
            if(link.id == linkId) {
                return {...link, url: e.target.value}
            } else {
                return link;
            }
        }));
    }

    function addNewLink () {
        setLinkUpdates([...linkUpdates, {id: `${newLinkId.current}`, label: "", url: ""}]);
        const lastLinkIdNum = newLinkId.current.substr(newLinkId.current.length - 1, 1);
        newLinkId.current = `n-${lastLinkIdNum + 1}`;
    }

    function discardChanges (){
        setShowEditLinks(false);
        setLinkUpdates(user.links);
        newLinkId.current = "n-0";
    }

    function validateLinks() : boolean {
        let linksAreValid = true;
        const validLinkFormat = /^(http|https):\/\/\w*\.\w*.\w*/;
        linkUpdates.map(link => {
            const linkIsValid = validLinkFormat.test(link.url);
            const linkHasLabel = link.label.trim() !== "";
            if(!linkIsValid){
                console.log(validLinkFormat.test(link.url) === false)
                console.log(link)
                setGlobalErrorMessage("Not all links are valid, ensure they follow this format http(s)://example.com or http(s)://subdomain.example.com");
                linksAreValid = false;
                return false;
            }
            if(!linkHasLabel) {
                setGlobalErrorMessage("All links must have a label");
                linksAreValid = false;
                return false;
            }
            return true;
        });
        return linksAreValid;
    }

    async function saveChanges () {
        if(! validateLinks()) return false;
        const data = {links: []};
        linkUpdates.forEach(link => {
            data.links.push({
                userId: user.id,
                label: link.label,
                url: link.url
            });
        });
        try{
            const res = await axios.put(`/api/users/${user.id}`, data, {
                headers: {
                    "Authorization": JWTToken
                }
            });
            const newUserData = res.data.user;
            setUser({
                ...user,
                links: newUserData.links
            });
            setLinkUpdates(newUserData.links);
            setShowEditLinks(false);
            newLinkId.current = "n-0";
            setGlobalSuccessMessage(res.data.message);
        }catch(err){
            console.log(err.response.data.message);
        }
    }

    return (
        <section className={styles["links"]}>
            {!showEditLinks && 
                <div onClick={()=> setShowEditLinks(true)} className={styles["edit-button"]}>
                    <FaPen />
                </div>
            }
            {showEditLinks && 
                <>
                    <div onClick={saveChanges} className={styles["save-button"]}>
                        <FaSave/>
                    </div>
                    <div onClick={discardChanges} className={styles["discard-button"]}>
                        <FaTrashAlt/>
                    </div>
                </>
            }
            <h4>Social Links</h4>
            {!showEditLinks &&
                <div>
                    {user.links[0] && user.links.map(link => {
                        return (
                            <div className={styles["user-link"]}>
                                <span>{link.label}</span><a target="_blank" href={link.url}>{link.url}</a>
                            </div>
                        )
                    })}
                    {!user.links[0] && <p>You haven't added any profile links.</p>}
                </div>
            }
            {showEditLinks &&
                <div>
                    <button onClick={addNewLink} className={styles['add-new-link-button']}>Add New Link</button>
                    {linkUpdates[0] && linkUpdates.map(link => {
                        return (
                            <div className={styles["edit-user-link"]}>
                                <fieldset>
                                    <label htmlFor="link-label">Label</label>
                                    <input onChange={updateLinkLabel} data-id={link.id} id="link-label" type="text" defaultValue={link.label} value={link.label}/>
                                </fieldset>
                                <fieldset>
                                    <label htmlFor="link-url">URL</label>
                                    <input onChange={updateLinkUrl} data-id={link.id} id="link-url" type="text" defaultValue={link.url} value={link.url}/>
                                </fieldset>
                            </div>
                        )
                    })}
                </div>
            }
        </section>
    );
}