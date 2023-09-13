import TerrestialPlanet from "../../models/terrestialPlanet";
import Slider from 'react-slider'
import PlanetColorsControl from "./planetColorsControl";
import { MAX_PLANET_MOUNTAINOUSNESS, MAX_PLANET_RADIUS, MAX_PLANET_STEEPNESS, MIN_PLANET_MOUNTAINOUSNESS, MIN_PLANET_RADIUS, MIN_PLANET_STEEPNESS } from "../../utils/constants";

interface Props{
    data: TerrestialPlanet;
    update: Function;
}

export default function TerrestialForm({data, update}: Props){

    return (
        <>
                <div className="control-item">
                    <label>Radius</label>
                    <Slider
                        min={MIN_PLANET_RADIUS}
                        max={MAX_PLANET_RADIUS}
                        value={data.radius}
                        onChange={(e)=>{
                            const diff = (data.radius ?? 0) - (data.waterLevel ?? 0);
                            update({radius: e, waterLevel: Math.min(Math.max(e - diff, 0), MAX_PLANET_RADIUS)})
                        }}

                        className="horizontal-slider"
                        thumbClassName="thumb"
                        trackClassName="track"
                        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                    />
                </div>
                <div className="control-item"><label>Base level</label>
                    <Slider
                        min={0}
                        max={MAX_PLANET_RADIUS * 10}
                        value={(data.waterLevel??0) * 10}
                        onChange={(e)=>update({waterLevel: e / 10})}

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
                        value={data.steepness}
                        onChange={(e)=>update({steepness: e})}

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
                        value={data.mountainousness}
                        onChange={(e)=>update({mountainousness: e})}

                        className="horizontal-slider"
                        thumbClassName="thumb"
                        trackClassName="track"
                        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                    />
                </div>
                <div className="control-item">
                    <label>Cloud count</label>
                    <Slider
                        min={0}
                        max={100}
                        value={(data.cloudCount??0)}
                        onChange={(e)=>update({cloudCount: e})}

                        className="horizontal-slider"
                        thumbClassName="thumb"
                        trackClassName="track"
                        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                    />
                </div>
                <div className="control-item">
                    <label>Cloud color</label>
                    <input type="color" value={data.cloudColor} onChange={(e) => update({cloudColor: e.target.value})}/>
                </div>
                <div className="control-item">
                    <label>Detail count</label>
                    <Slider
                        min={0}
                        max={10}
                        value={(data.detailCount??0)}
                        onChange={(e)=>update({detailCount: e})}

                        className="horizontal-slider"
                        thumbClassName="thumb"
                        trackClassName="track"
                        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                    />
                </div>
                <div className="control-item">
                    <label>
                        <input className={data.enableWater ? "checked" : ""} onChange={(e)=>update({enableWater: !data.enableWater})} type="checkbox"/>
                        Enable water
                    </label>
                </div>
                <div className="control-item">
                    <label>
                        <input className={data.enableVegetation ? "checked" : ""} onChange={(e)=>update({enableVegetation: !data.enableVegetation})} type="checkbox"/>
                        Enable vegetation
                    </label>
                </div>
                <PlanetColorsControl planet={data} update={update}></PlanetColorsControl>
        </>
    )
}