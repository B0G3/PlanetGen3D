import * as THREE from "three";
import GasPlanet from "../../models/gasPlanet";
import TerrestialPlanet from "../../models/terrestialPlanet";
import TerrestialPlanetGeometry from "./terrestialPlanet";
import PlanetClouds from "./planetClouds";
import PlanetModel from "../../models/planet";

export default function Planet({planet} : {planet: PlanetModel}){
    return (<>
        {planet instanceof TerrestialPlanet && <>
            <TerrestialPlanetGeometry planet={planet}></TerrestialPlanetGeometry>
        </>}

        {planet instanceof GasPlanet && <mesh>
            <sphereGeometry args={[planet.radius, 16, 16]}></sphereGeometry>
            <meshBasicMaterial
                    side={THREE.DoubleSide}
                    attach="material" color={"#ffffff"}
            />
        </mesh>}
        {/* <Cloud planet={planet as Celestial}></Cloud> */}
        <PlanetClouds planet={planet}></PlanetClouds>

        {(!!planet.ring) && <mesh>
            <ringGeometry args={[planet.ring.startDistance, planet.ring.endDistance, 16]}></ringGeometry>
            <meshBasicMaterial
                    side={THREE.DoubleSide}
                    attach="material" color={"#ffffff"}
            />
        </mesh>}
    </>)
}