import React from "react";
import TerrestialPlanet from "../../../models/terrestialPlanet";
import Star from "../../../models/star";
import CelestialModel from "../../../models/celestial";
import GasPlanet from "../../../models/gasPlanet";
import PlanetGeometry from "./planet";
import StarGeometry from "./star";
import SatelliteGeometry from "../satellite";
import BlackHoleGeometry from "./blackHole";
import { useFrame } from "@react-three/fiber";
import BlackHole from "../../../models/blackHole";

interface Props{
    celestial: CelestialModel,
    setSelectedEntity: Function,
}

export default function Celestial({celestial, setSelectedEntity} : Props){
    // const [hovered, setHovered] = React.useState(false)
    const [rotationXSpeed, setRotationXSpeed] = React.useState((Math.random() * 6 - 3) / 10000)
    const [rotationYSpeed, setRotationYSpeed] = React.useState((Math.random() * 6 - 3) / 10000)
    const [rotationZSpeed, setRotationZSpeed] = React.useState((Math.random() * 6 - 3) / 10000)
    
    // console.log(setHovered);
    const ref = React.useRef<any>();
    React.useEffect(()=>{
        celestial.setGeometry(ref.current);
    }, [ref])

    // React.useEffect(() => {
    //     document.body.style.cursor = hovered ? 'pointer' : 'auto'
    //     // return () => document.body.style.cursor = 'auto';
    // }, [hovered])

    useFrame(()=>{
        const rotation = ref.current?.rotation;
        if(rotation) ref.current?.rotation.set(rotation.x  + rotationXSpeed, rotation.y + rotationYSpeed, rotation.z + rotationZSpeed);
    })

    return <>
        <group 
        // onClick={(event)=>(setSelectedEntity(celestial), event.stopPropagation())} 
        ref={ref} position={celestial.position}>
            {(celestial instanceof TerrestialPlanet || celestial instanceof GasPlanet) && 
                <PlanetGeometry key={celestial.id} planet={celestial}></PlanetGeometry>
            }
            {(celestial instanceof Star) && 
                <StarGeometry key={celestial.id} star={celestial}></StarGeometry>
            }
            {(celestial instanceof BlackHole) && 
                <BlackHoleGeometry key={celestial.id} blackHole={celestial}></BlackHoleGeometry>
            }
        </group>
            {celestial.satellites?.map((v, i) => {
                return (
                <SatelliteGeometry key={v.entity.id} satellite={v} setSelectedEntity={setSelectedEntity}></SatelliteGeometry>
            )})}
    </>
        
    
}