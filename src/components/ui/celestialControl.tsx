import React from "react";
import Celestial from "../../models/celestial";
import TerrestialPlanet from "../../models/terrestialPlanet";
import Star from "../../models/star";
import GasPlanet from "../../models/gasPlanet";
import TerrestialForm from "./terrestialForm";
import StarForm from "./starForm";
import BlackHole from "../../models/blackHole";
import BlackHoleForm from "./blackHoleForm";

interface Props{
    data: Celestial;
    update: Function;
}

export default function CelestialControl({data, update} : Props){
    const [collapsed, setCollapsed] = React.useState(false);
    return (
        <div style={{'margin': '8px 0 0 0'}}>
            <div onClick={()=>setCollapsed(!collapsed)} className="title toggleable">CELESTIAL CONTROLS
            
                <svg className={"toggle" + (collapsed?' collapsed':'')} xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 16 16" shapeRendering="crispEdges">
                    <path stroke="#252525" d="M0 3h2M14 3h2M0 4h3M13 4h3M0 5h4M12 5h4M0 6h5M11 6h5M1 7h5M10 7h5M2 8h5M9 8h5M3 9h10M4 10h8M5 11h6M6 12h4M7 13h2" />
                </svg>
            </div>

            {!collapsed && <>
            <div className="control-item">
                <label>Name</label>
                <input value={data.name} onChange={(e)=>update({name: e.target.value})} type="text"/>
            </div>
            {data instanceof TerrestialPlanet && <TerrestialForm data={data} update={update}></TerrestialForm>}
            {data instanceof BlackHole && <BlackHoleForm data={data} update={update}></BlackHoleForm>}
            {data instanceof Star && <StarForm data={data} update={update}></StarForm>}
            {data instanceof GasPlanet && 
                <>
                </>
            }
            </>}
        </div>
    )
}