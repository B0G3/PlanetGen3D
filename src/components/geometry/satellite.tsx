import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import SatelliteModel from "../../models/satellite";
import * as THREE from 'three';
import Renderable from "./renderable";
import Celestial from "../../models/celestial"
import { Line, PointMaterial } from "@react-three/drei";

interface Props{
    satellite: SatelliteModel,
    selected?: boolean
}

function HollowCircle({radius, segments} : {radius: number, segments: number}) {
    const circleVertices = [];
  
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      circleVertices.push(new THREE.Vector3(x, y, 0));
    }
  
    return (
        <Line lineWidth={2} points={circleVertices} color="white" transparent={true} opacity={0.1}></Line>
    );
}

export default function Satellite({satellite, selected = false} : Props){
    const childRef = useRef<THREE.Group>(null);
    const [startZ, setStartZ] = useState(Math.random() * Math.PI);
    const distance = (satellite.parent instanceof Celestial) ? (satellite.parent.radius + satellite.distance) : satellite.distance;

    useEffect(() => {
        let rotation = childRef.current?.rotation;
        if(rotation) childRef.current?.rotation.set(rotation.x, rotation.y + 0 , rotation.z + startZ);
    }, [childRef]);

    useFrame((state, delta) => {
        let rotation = childRef.current?.rotation;
        let speed = satellite.speed * delta * 10;
        speed /= distance;
        if(rotation) childRef.current?.rotation.set(rotation.x, rotation.y, rotation.z + speed);
    })

    return (<>
            <group rotation={[satellite.tiltX, satellite.tiltY, 0]} ref={childRef}>
                {/* {selected && <HollowCircle radius={distance} segments={32}></HollowCircle>} */}
                <HollowCircle radius={distance} segments={32}></HollowCircle>
                <group position={[0,distance,0]} >
                    <Renderable renderable={satellite.entity}></Renderable>
                </group>
            </group>
            </>
        );

    
}