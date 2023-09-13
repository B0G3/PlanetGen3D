import React from "react";
import TerrestialPlanet from "../../models/terrestialPlanet"
import hexColor from "../../types/hexColor";

interface Props{
    planet: TerrestialPlanet,
    update: Function
}

export default function PlanetColorsControl({planet, update} : Props){
    const handleInputChange = (name : string, value : string) => {
        const colors = planet.colors;
        if(name === 'ice') colors.setIce(value as hexColor);
        if(name === 'rock') colors.setRock(value as hexColor);
        if(name === 'grass') colors.setGrass(value as hexColor);
        if(name === 'sand') colors.setSand(value as hexColor);
        if(name === 'water') colors.setWater(value as hexColor);
        colors.needsUpdate = !colors.needsUpdate;
        update({colors: colors})
    }

    return (
        <div className="planet-color-controls">
            <div>
                <input type="color" value={planet.colors.ice} onChange={(e) => handleInputChange('ice', e.target.value)}/>
                <label>Ice</label>
            </div>
            <div>
                <input type="color" value={planet.colors.rock} onChange={(e) => handleInputChange('rock', e.target.value)}/>
                <label>Rock</label>
            </div>
            <div>
                <input type="color" value={planet.colors.grass} onChange={(e) => handleInputChange('grass', e.target.value)}/>
                <label>Grass</label>
            </div>
            <div>
                <input type="color" value={planet.colors.sand} onChange={(e) => handleInputChange('sand', e.target.value)}/>
                <label>Sand</label>
            </div>
            <div>
                <input type="color" value={planet.colors.water} onChange={(e) => handleInputChange('water', e.target.value)}/>
                <label>Water</label>
            </div>
        </div>
    )
}