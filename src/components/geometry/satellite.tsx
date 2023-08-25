import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import SatelliteModel from "../../models/satellite";
import * as THREE from 'three';
import Renderable from "./renderable";

interface Props{
    satellite: SatelliteModel
}

export default function Satellite({satellite} : Props){
    const childRef = useRef<THREE.Group>(null);
    const [startZ, setStartZ] = useState(Math.random() * Math.PI);

    useEffect(() => {
        let rotation = childRef.current?.rotation;
        if(rotation) childRef.current?.rotation.set(rotation.x, rotation.y + 0 , rotation.z + startZ);
    }, [childRef]);

    useFrame((state, delta) => {
        let rotation = childRef.current?.rotation;
        if(rotation) childRef.current?.rotation.set(rotation.x, rotation.y, rotation.z + satellite.speed * delta);
    })

    return (
        <group rotation={[satellite.tiltX, satellite.tiltY, 0]} ref={childRef}>
            <axesHelper args={[10]}></axesHelper>
            <group position={[0,satellite.distance,0]} >
                <axesHelper args={[10]}></axesHelper>
                <Renderable renderable={satellite.entity}></Renderable>
            </group>
        </group>
    );
    
}