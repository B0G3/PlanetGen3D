import CelestialModel from "../../models/celestial"
import RenderableModel from "../../models/renderable"
import Celestial from "./celestial/celestial"

interface Props{
    renderable: RenderableModel,
    setSelectedEntity: Function
}

export default function Renderable({renderable, setSelectedEntity} : Props){
    return (<>
        {renderable instanceof CelestialModel &&
            <Celestial celestial={renderable} setSelectedEntity={setSelectedEntity}></Celestial>
        }
    </>)
}