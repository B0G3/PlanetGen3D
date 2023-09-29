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
    return (
        <div>
            <div className="title">CELESTIAL CONTROLS</div>
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
        </div>
    )
}