import React from "react";
import TerrestialPlanet from "../../../models/terrestialPlanet";
import Star from "../../../models/star";
import CelestialModel from "../../../models/celestial";
import GasPlanet from "../../../models/gasPlanet";
import PlanetGeometry from "./planet";
import StarGeometry from "./star";
import SatelliteGeometry from "../satellite";

interface Props{
    celestial: CelestialModel
}

export default function Celestial({celestial} : Props){
    const ref = React.useRef<any>();
    React.useEffect(()=>{
        celestial.setGeometry(ref.current);
    }, [ref])

    return <>
        <group ref={ref} position={celestial.position}>
            {(celestial instanceof TerrestialPlanet || celestial instanceof GasPlanet) && 
                <PlanetGeometry key={celestial.id} planet={celestial}></PlanetGeometry>
            }
            {(celestial instanceof Star) && 
                <StarGeometry key={celestial.id} star={celestial}></StarGeometry>
            }
            {celestial.satellites?.map((v, i) => {
                return (
                <SatelliteGeometry key={v.entity.id} satellite={v}></SatelliteGeometry>
            )})}
        </group>
        
    </>
        
    
}