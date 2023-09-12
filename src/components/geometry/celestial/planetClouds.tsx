import React from "react";
import * as THREE from "three"
import TerrestialPlanet from "../../../models/terrestialPlanet";
import { colorVariation } from "../../../utils/helpers";
import { createNoise4D } from "simplex-noise";
import { useFrame } from "@react-three/fiber";
import Planet from "../../../models/planet";
import { colord } from "colord";
import hexColor from "../../../types/hexColor";
const noise4D = createNoise4D();

const cloudMaterial = new THREE.MeshBasicMaterial({ color: "white", vertexColors: true });

function Cloud({distance, direction, hexColor} : {distance: number, direction: THREE.Vector3, hexColor: hexColor}){
    const v3 = new THREE.Vector3();
    const offset = new THREE.Vector3();
    const ref = React.useRef<THREE.InstancedMesh>(null);
    const [count, setCount] = React.useState(Math.random()*1000);
    const [tiltX, setTiltX] = React.useState(Math.random()*Math.PI)
    const [tiltY, setTiltY] = React.useState(Math.random()*Math.PI)
    const groupRef = React.useRef<THREE.Group>(null);
    const puffCount = React.useMemo(()=> (Math.ceil(distance)), [distance])
    const puffGeometry = React.useMemo(()=>{
        const geometry = new THREE.IcosahedronGeometry(1, 1);
        const positions = geometry.attributes.position;
        geometry.setAttribute( 'color', new THREE.BufferAttribute( new Float32Array( positions.count * 3 ), 3 ) );
        const colors = geometry.attributes.color;
        const color = new THREE.Color();
        const seed = Math.random()*1000;
        let k = 0;
        for (let i = 0; i < positions.count; i++){
            
            v3.fromBufferAttribute(positions, i);

            const noise = noise4D(v3.x, v3.y, v3.z, seed)
            const hex = colorVariation(colord(hexColor), 0.2).toHex();
            color.set(hex);

            if(i%3===0){
                colors.setXYZ(k * 3 + 0, color.r, color.g, color.b);
                colors.setXYZ(k * 3 + 1, color.r, color.g, color.b);
                colors.setXYZ(k * 3 + 2, color.r, color.g, color.b);
                k++;
            }
            
            v3.addScaledVector(v3, noise * 0.5);
            positions.setXYZ(i, v3.x, v3.y, v3.z)
        }

        return geometry;
    }, [hexColor])

    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const upVector = new THREE.Vector3(0, 1, 0);

    // Iterate over puffs, randomize their positions & randomize rotation...
    React.useEffect(()=>{
        for(let i = 0; i < puffCount; i++){
            // Randomize position in the cluster
            const theta = Math.random() * Math.PI; // Polar angle
            const phi = Math.random() * Math.PI * 2; // Azimuthal angle
            const radius_multiplier = 2.5 + Math.sqrt(distance)/8;
            const radius = Math.random() * radius_multiplier; // Random radius within maxRadius

            const scalingFactor = 1 - (radius)/radius_multiplier + Math.random() * 0.2; // Smaller as radius increases
        
            // Scale the sphere size based on the scaling factor
            const sphereSize = scalingFactor * 0.65 + 0.1; // Adjust the multiplier as needed

            // Convert spherical coordinates to Cartesian coordinates
            const x = 0 + radius * Math.sin(theta) * Math.cos(phi);
            const y = 0 + radius * Math.sin(theta) * Math.sin(phi);
            const z = 0 + radius * Math.cos(theta);

            offset.set(x,y,z);

            // Randomize rotation
            quaternion.setFromUnitVectors(upVector, new THREE.Vector3(Math.random(),Math.random(),Math.random()))
            // Randomize size
            const size = Math.random() * 0.5 + 0.1

            v3.copy(direction).multiplyScalar(distance + 2).add(offset).setLength(distance + 2 - Math.random() * 0.5);
            matrix.compose(v3, quaternion, new THREE.Vector3(sphereSize, sphereSize, sphereSize));

            if(ref && ref.current) ref.current.setMatrixAt(i, matrix);
        }

        if(ref.current){ 
            ref.current.instanceMatrix.needsUpdate = true;
            ref.current.computeBoundingSphere();
        }
    }, [ref, distance])

    useFrame((state, delta) => {
        setCount(count + 0.001);
        let rotation = groupRef.current?.rotation;
        let speed = ((Math.sin(count)) / distance) * 0.01;
        if(rotation) groupRef.current?.rotation.set(rotation.x, rotation.y, rotation.z + speed);
    })

    return (
        <group rotation={[tiltX, tiltY, 0]} ref={groupRef}>
                <instancedMesh ref={ref} args={[puffGeometry, cloudMaterial, puffCount]}></instancedMesh>
        </group>
    )
}

export default function PlanetClouds({planet} : {planet: Planet}){
    const distance = (planet instanceof TerrestialPlanet)?(Math.max(planet.radius, planet.waterLevel)):planet.radius;
    const v3 = new THREE.Vector3();

    // Generate fibonacci points - each point is a cloud
    const fibonacciPoints = React.useMemo(()=>{
        const points = [];
        const yOffset = 2 / planet.cloudCount;
        const phi = Math.PI * (3.0 - Math.sqrt(5.0));
        for (let i = 0; i < planet.cloudCount; i++) {
            const y = i * yOffset - 1 + yOffset / 2;
            const r = Math.sqrt(1 - y * y);
            const theta = phi * i;
            const x = Math.cos(theta) * r;
            const z = Math.sin(theta) * r;
            const variation = Math.random() * 6 - 3;
            v3.set(x + variation, y + variation, z + variation).normalize();
            points.push(v3.clone());
        }
        return points;
    }, [planet.cloudCount])

    return (
        <>
            {fibonacciPoints.map((e, k) => 
                <Cloud key={k} distance={distance} direction={e} hexColor={planet.cloudColor}></Cloud>
            )}
        </>
    )
}