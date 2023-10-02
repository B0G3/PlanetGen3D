import Slider from 'react-slider'
import Planet from '../../models/planet';
import hexColor from '../../types/hexColor';
import PlanetRing from '../../interfaces/planetRing';
import { radiansToDegrees } from '../../utils/helpers';
import { MAX_PLANET_RADIUS } from '../../utils/constants';

interface Props{
    planet: Planet,
    update: Function
}

export default function RingForm({planet, update}: Props){

    const handleInputChange = (name : string, value : any) => {
        const ring = planet.ring;
        update({ring: {...ring, [name]: value}})
    }


    return (
        <div className="ring-form">
            <div className="title">RING SETTINGS</div>
            <div className="control-item">
                <label>Speed</label>
                <Slider
                    min={1}
                    max={100}
                    value={planet.ring.speed * 100}
                    onChange={(e)=>handleInputChange('speed', e / 100)}

                    className="horizontal-slider"
                    thumbClassName="thumb"
                    trackClassName="track"
                    renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                />
            </div>
            <div className="control-item">
                <label>Density</label>
                <Slider
                    min={1}
                    max={100}
                    value={planet.ring.density * 100}
                    onChange={(e)=>handleInputChange('density', e / 100)}

                    className="horizontal-slider"
                    thumbClassName="thumb"
                    trackClassName="track"
                    renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                />
            </div>
            <div className="control-item">
                <label>Distance</label>
                <Slider
                    min={1}
                    max={MAX_PLANET_RADIUS}
                    value={planet.ring.startDistance}
                    onChange={(e)=>handleInputChange('startDistance', e)}

                    className="horizontal-slider"
                    thumbClassName="thumb"
                    trackClassName="track"
                    renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                />
            </div>
            <div className="control-item">
                <label>Width</label>
                <Slider
                    min={1}
                    max={MAX_PLANET_RADIUS}
                    value={planet.ring.width}
                    onChange={(e)=>handleInputChange('width', e)}

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
                    value={planet.ring.tiltX * 1000}
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
                    value={planet.ring.tiltY * 1000}
                    onChange={(e)=>handleInputChange('tiltY', e / 1000)}

                    className="horizontal-slider"
                    thumbClassName="thumb"
                    trackClassName="track"
                    renderThumb={(props, state) => <div {...props}>{Math.round(radiansToDegrees(state.valueNow / 1000))}</div>}
                />
            </div>
            <div className="control-item">
                    <label>Color</label>
                    <input type="color" value={planet.ring.color} 
                    onChange={(e)=>handleInputChange('color', e.target.value)}/>
            </div>
        </div>
    )
}