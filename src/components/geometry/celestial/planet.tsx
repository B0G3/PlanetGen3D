import GasPlanet from "../../../models/gasPlanet";
import TerrestialPlanet from "../../../models/terrestialPlanet";
import TerrestialPlanetGeometry from "./terrestial/terrestialPlanet";
import GasPlanetGeometry from "./gasPlanet";
import PlanetClouds from "./planetClouds";
import PlanetModel from "../../../models/planet";
import PlanetRing from "./planetRing";

export default function Planet({planet} : {planet: PlanetModel}){
    return (<>
        {planet instanceof TerrestialPlanet && <>
            <TerrestialPlanetGeometry planet={planet}></TerrestialPlanetGeometry>
        </>}

        {planet instanceof GasPlanet && <>
            <GasPlanetGeometry planet={planet}></GasPlanetGeometry>
        </>}
        <PlanetClouds planet={planet}></PlanetClouds>
        {planet.ring.enabled && <PlanetRing planet={planet}></PlanetRing>}
    </>)
}