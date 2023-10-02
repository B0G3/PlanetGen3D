import React from "react";
import hexColor from "../../types/hexColor";
import { useGlobalSettingsContext } from "./globalSettingsContext";

export default function GlobalForm(){
    const { backgroundColor, setBackgroundColor, trajectories, setTrajectories } = useGlobalSettingsContext();

    return (
        <div>
            <div className="control-item">
                    <label>Background color</label>
                    <input type="color" value={backgroundColor} 
                    onChange={(e) => setBackgroundColor(e.target.value as hexColor)}/>
            </div>
            <div className="control-item">
                    <label>
                        <input className={trajectories ? "checked" : ""} onChange={(e)=>setTrajectories(!trajectories)} type="checkbox"/>
                        Show trajectories
                    </label>
                </div>


        </div>
    )
}