import Slider from 'react-slider'
import { MAX_STAR_RADIUS, MIN_STAR_RADIUS } from "../../utils/constants";
import Star from "../../models/star";
interface Props{
    data: Star;
    update: Function;
}

export default function StarForm({data, update}: Props){

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
                <div className="control-item">
                    <label>Fluctuations</label>
                    <Slider
                        min={0}
                        max={100}
                        value={(data?.fluctuations??0) * 50}
                        onChange={(e)=> update({fluctuations: e/50})}

                        className="horizontal-slider"
                        thumbClassName="thumb"
                        trackClassName="track"
                        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                    />
                </div>
                <div className="control-item">
                    <label>Color</label>
                    <input type="color" value={data.color} onChange={(e) => update({color: e.target.value})}/>
                </div>
        </>
    )
}