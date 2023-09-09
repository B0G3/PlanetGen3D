import * as THREE from "three";
import GasPlanet from "../../../models/gasPlanet";
import TerrestialPlanet from "../../../models/terrestialPlanet";
import TerrestialPlanetGeometry from "./terrestial/terrestialPlanet";
import GasPlanetGeometry from "./gasPlanet";
import PlanetClouds from "./planetClouds";
import PlanetModel from "../../../models/planet";

export default function Planet({planet} : {planet: PlanetModel}){
    return (<>
        {planet instanceof TerrestialPlanet && <>
            <TerrestialPlanetGeometry planet={planet}></TerrestialPlanetGeometry>
        </>}

        {planet instanceof GasPlanet && <>
            <GasPlanetGeometry planet={planet}></GasPlanetGeometry>
        </>}
        <PlanetClouds planet={planet}></PlanetClouds>
        {/* {(!!planet.ring) && <mesh>
            <ringGeometry args={[planet.ring.startDistance, planet.ring.endDistance, 16]}></ringGeometry>
            <meshBasicMaterial
                    side={THREE.DoubleSide}
                    attach="material" color={"#ffffff"}
            />
        </mesh>} */}
    </>)
}