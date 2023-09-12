import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import SatelliteModel from "../../models/satellite";
import * as THREE from 'three';
import Renderable from "./renderable";
import Celestial from "../../models/celestial"
import { Line, PointMaterial } from "@react-three/drei";
import TerrestialPlanet from "../../models/terrestialPlanet";

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
        <Line lineWidth={1} points={circleVertices} color="white" transparent={true} opacity={0.1}></Line>
    );
}

export default function Satellite({satellite} : Props){
    const childRef = useRef<THREE.Group>(null);
    const entityRef = useRef<THREE.Group>(null);
    const [startZ, setStartZ] = useState(Math.random() * Math.PI);
    const parent_radius = ((satellite.parent instanceof Celestial) ? ((satellite.parent instanceof TerrestialPlanet)?(Math.max(satellite.parent.radius, satellite.parent.waterLevel)):satellite.parent.radius + satellite.distance) : satellite.distance);
    const child_radius = ((satellite.entity instanceof Celestial) ? ((satellite.entity instanceof TerrestialPlanet)?(Math.max(satellite.entity.radius, satellite.entity.waterLevel)):satellite.entity.radius + satellite.distance) : satellite.distance);
    const distance = parent_radius + child_radius + satellite.distance;

    useEffect(() => {
        let rotation = childRef.current?.rotation;
        if(rotation) childRef.current?.rotation.set(rotation.x, rotation.y + 0 , rotation.z + startZ);
    }, [childRef]);

    useFrame((state, delta) => {
        // Satellite
        let rotation = childRef.current?.rotation;
        let speed = (satellite.speed * delta * 10 )/ distance;
        if(rotation) childRef.current?.rotation.set(rotation.x, rotation.y, rotation.z + speed);
    })

    return (<>
            <group rotation={[satellite.tiltX, satellite.tiltY, 0]} ref={childRef}>
                <group position={[0,distance,0]} ref={entityRef}>
                    <Renderable renderable={satellite.entity}></Renderable>
                </group>

                <HollowCircle radius={distance} segments={32}></HollowCircle>
            </group>
        </>);

    
}