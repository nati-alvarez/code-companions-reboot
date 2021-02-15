import LoadingAnimation from "@components/LoadingAnimation";
import { CSSProperties } from "react";

export default function LoadingPage(){
    const styles = {
        width: "100vw",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        display: "flex", 
        flexDirection: "column",
    } as CSSProperties;
    return (
        <div style={styles}>
            <p style={{marginTop: "-10rem"}}>Loading...</p>
            <LoadingAnimation/>
        </div>
    )
}