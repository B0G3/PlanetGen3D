import React from "react";
import Satellite from "../../models/satellite"
import SatelliteInterface from "../../interfaces/satellite";
import Slider from 'react-slider'
import { radiansToDegrees } from "../../utils/helpers";

interface Props{
    data:  Satellite;
    update: Function;
}


export default function SatelliteControl({data, update} : Props){
    const [editedObject, setEditedObject] = React.useState<SatelliteInterface>({ ...data });
    const [collapsed, setCollapsed] = React.useState(false);

    const handleInputChange = (name : string, value : number) => {
        setEditedObject((prev) => ({ ...prev, [name]: value }));
    };

    React.useEffect(() => {
        setEditedObject({...data});
    }, [data])

    React.useEffect(() => {
        update({
            distance: editedObject.distance,
            speed: editedObject.speed,
            tiltX: editedObject.tiltX,
            tiltY: editedObject.tiltY,
        });
    }, [editedObject])

    return (
        <div>
            <div onClick={()=>setCollapsed(!collapsed)} className="title">ORBIT CONTROLS</div>
            {!collapsed && <>
                <div className="control-item">
                <label>Distance</label>
                <Slider
                    min={0}
                    max={1024}
                    value={editedObject.distance}
                    onChange={(e)=>handleInputChange('distance', e)}

                    className="horizontal-slider"
                    thumbClassName="thumb"
                    trackClassName="track"
                    renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                />
            </div>
            <div className="control-item">
                <label>Speed</label>
                <Slider
                    min={1}
                    max={200}
                    value={editedObject.speed * 100}
                    onChange={(e)=>handleInputChange('speed', e / 100)}

                    className="horizontal-slider"
                    thumbClassName="thumb"
                    trackClassName="track"
                    renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                />
            </div>
            <div className="control-item">
                <label>X-Axis tilt</label>
                <Slider
                    min={-Math.PI/2 * 1000}
                    max={Math.PI/2 * 1000}
                    value={editedObject.tiltX * 1000}
                    onChange={(e)=>handleInputChange('tiltX', e / 1000)}

                    className="horizontal-slider"
                    thumbClassName="thumb"
                    trackClassName="track"
                    renderThumb={(props, state) => <div {...props}>{Math.round(radiansToDegrees(state.valueNow / 1000))}</div>}
                />
            </div>
            <div className="control-item">
                <label>Y-Axis tilt</label>
                <Slider
                    min={-Math.PI/2 * 1000}
                    max={Math.PI/2 * 1000}
                    value={editedObject.tiltY * 1000}
                    onChange={(e)=>handleInputChange('tiltY', e / 1000)}

                    className="horizontal-slider"
                    thumbClassName="thumb"
                    trackClassName="track"
                    renderThumb={(props, state) => <div {...props}>{Math.round(radiansToDegrees(state.valueNow / 1000))}</div>}
                />
            </div>
            </>}
        </div>
    )
}