import * as THREE from "three";
import PlanetInterface from "../../interfaces/planet";
import Celestial from "../../models/celestial";
import GasPlanet from "../../models/gasPlanet";
import TerrestialPlanet from "../../models/terrestialPlanet";
import Satellite from "./satellite";
import TerrestialPlanetGeometry from "./terrestialPlanet/planet"

export default function Planet({planet} : {planet: PlanetInterface}){

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
        {planet.clouds?.map((e, k) => {
            <Satellite key={k} satellite={e}></Satellite>
        })}
        {(!!planet.ring) && <mesh>
            <ringGeometry args={[planet.ring.startDistance, planet.ring.endDistance, 16]}></ringGeometry>
            <meshBasicMaterial
                    side={THREE.DoubleSide}
                    attach="material" color={"#ffffff"}
            />
        </mesh>}
    </>)
}