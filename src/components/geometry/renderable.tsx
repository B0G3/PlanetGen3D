import CelestialModel from "../../models/celestial"
import RenderableModel from "../../models/renderable"
import Celestial from "./celestial"

interface Props{
    renderable: RenderableModel
}

export default function Renderable({renderable} : Props){
    return (<>
        {renderable instanceof CelestialModel &&
            <Celestial celestial={renderable}></Celestial>
        }
        {/* TODO: Other entities - clouds, ufo? etc. */}
    </>)
}