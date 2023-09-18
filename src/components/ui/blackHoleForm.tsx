import Slider from 'react-slider'
import { MAX_STAR_RADIUS, MIN_STAR_RADIUS } from "../../utils/constants";
import BlackHole from '../../models/blackHole';
interface Props{
    data: BlackHole;
    update: Function;
}

export default function BlackHoleForm({data, update}: Props){

    return (
        <>
                <div className="control-item">
                    <label>Radius</label>
                    <Slider
                        min={MIN_STAR_RADIUS}
                        max={MAX_STAR_RADIUS}
                        value={data.radius}
                        onChange={(e)=>update({radius: e})}

                        className="horizontal-slider"
                        thumbClassName="thumb"
                        trackClassName="track"
                        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                    />
                </div>
        </>
    )
}