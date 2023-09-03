import React from "react";
import CelestialInterface from "../../interfaces/celestial";
import Celestial from "../../models/celestial";
import Slider from 'react-slider'
import TerrestialPlanet from "../../models/terrestialPlanet";
import { MAX_PLANET_MOUNTAINOUSNESS, MAX_PLANET_RADIUS, MAX_PLANET_STEEPNESS, MAX_STAR_RADIUS, MIN_PLANET_MOUNTAINOUSNESS, MIN_PLANET_RADIUS, MIN_PLANET_STEEPNESS, MIN_STAR_RADIUS } from "../../utils/constants";
import Star from "../../models/star";
import {GithubPicker} from 'react-color'
import hexColor from "../../types/hexColor";
interface Props{
    data:  Celestial;
    update: Function;
}

interface Data{
    name?: string;
    radius?: number;
    waterLevel?: number
    steepness?: number;
    mountainousness?: number;
    color?: hexColor;
    fluctuations?: number;
    detailCount?: number;
}

export default function CelestialControl({data, update} : Props){
    const [editedObject, setEditedObject] = React.useState<Data>({ ...data });

    const handleInputChange = (name : string, value : any) => {
        if(name === 'radius'){
            const diff = (editedObject.radius ?? 0) - (editedObject.waterLevel ?? 0);
            setEditedObject((prev) => ({ ...prev, [name]: value, waterLevel: Math.min(Math.max(value - diff, 0), MAX_PLANET_RADIUS)}));
        }else setEditedObject((prev) => ({ ...prev, [name]: value }));
    };

    React.useEffect(() => {
        setEditedObject({...data});
    }, [data])

    React.useEffect(() => {
        update(editedObject);
    }, [editedObject])

    return (
        <div style={{"margin": '1rem 0 0 0'}}>
            <div className="title">CELESTIAL CONTROLS</div>
            {data instanceof TerrestialPlanet &&
                <>
                <div className="control-item">
                    <label>Radius</label>
                    <Slider
                        min={MIN_PLANET_RADIUS}
                        max={MAX_PLANET_RADIUS}
                        value={editedObject.radius}
                        onChange={(e)=>handleInputChange('radius', e)}

                        className="horizontal-slider"
                        thumbClassName="thumb"
                        trackClassName="track"
                        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                    />
                </div>
                <div className="control-item"><label>Water level</label>
                    <Slider
                        min={0}
                        max={MAX_PLANET_RADIUS * 10}
                        value={(editedObject.waterLevel??0) * 10}
                        onChange={(e)=>handleInputChange('waterLevel', e / 10)}

                        className="horizontal-slider"
                        thumbClassName="thumb"
                        trackClassName="track"
                        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                    />
                </div>
                <div className="control-item">
                    <label>Terrain variety</label>
                    <Slider
                        min={MIN_PLANET_STEEPNESS}
                        max={MAX_PLANET_STEEPNESS}
                        value={editedObject.steepness}
                        onChange={(e)=>handleInputChange('steepness', e)}

                        className="horizontal-slider"
                        thumbClassName="thumb"
                        trackClassName="track"
                        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                    />
                </div>
                <div className="control-item">
                    <label>Mountainousness</label>
                    <Slider
                        min={MIN_PLANET_MOUNTAINOUSNESS}
                        max={MAX_PLANET_MOUNTAINOUSNESS}
                        value={editedObject.mountainousness}
                        onChange={(e)=>handleInputChange('mountainousness', e)}

                        className="horizontal-slider"
                        thumbClassName="thumb"
                        trackClassName="track"
                        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                    />
                </div>
                <hr></hr>  
                <div className="control-item">
                    <label>Detail count</label>
                    <Slider
                        min={0}
                        max={100}
                        value={(editedObject.detailCount??0) * 10}
                        onChange={(e)=>handleInputChange('detailCount', e / 10)}

                        className="horizontal-slider"
                        thumbClassName="thumb"
                        trackClassName="track"
                        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                    />
                </div>
                <div className="control-item">
                    <label>Detail proportions</label>
                    <Slider
                        className="horizontal-slider"
                        thumbClassName="thumb"
                        trackClassName="track"
                        defaultValue={[0, 100]}
                        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                        pearling
                        minDistance={0}
                    />
                </div>
                </>}
            {data instanceof Star && 
                <>
                <div className="control-item">
                    <label>Radius</label>
                    <Slider
                        min={MIN_STAR_RADIUS}
                        max={MAX_STAR_RADIUS}
                        value={editedObject.radius}
                        onChange={(e)=>handleInputChange('radius', e)}

                        className="horizontal-slider"
                        thumbClassName="thumb"
                        trackClassName="track"
                        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                    />
                </div>
                <div className="control-item">
                    <label>Fluctuations</label>
                    <Slider
                        min={0}
                        max={100}
                        value={(editedObject?.fluctuations??0) * 50}
                        onChange={(e)=>handleInputChange('fluctuations', e/50)}

                        className="horizontal-slider"
                        thumbClassName="thumb"
                        trackClassName="track"
                        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                    />
                </div>
                <div className="control-item">
                    <label>Color</label>
                    <input type="color" value={editedObject.color} onChange={(e) => handleInputChange('color', e.target.value)}/>
                </div>
                </>
            }
        </div>
    )
}