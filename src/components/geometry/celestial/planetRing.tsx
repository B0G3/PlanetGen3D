import * as THREE from "three";
import Planet from "../../../models/planet";
import React, { useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { createNoise4D } from "simplex-noise";
import { colorVariation } from "../../../utils/helpers";
import { colord } from "colord";
const noise4D = createNoise4D();
const rockMaterial = new THREE.MeshBasicMaterial({ color: "white", vertexColors: true });

export default function PlanetRing({planet}:{planet: Planet}){
    const groupRef = React.useRef<THREE.Group>(null);
    const innerGroupRef = React.useRef<THREE.Group>(null);
    const meshRef = React.useRef<THREE.InstancedMesh>(null);
    const quaternion = new THREE.Quaternion();
    const v3 = new THREE.Vector3();
    const SURFACE_AREA = Math.PI * Math.pow((planet.radius + planet.ring.startDistance + planet.ring.width), 2) - Math.PI * Math.pow((planet.radius + planet.ring.startDistance), 2)
    const POINT_COUNT = SURFACE_AREA * (planet.ring.density);
    const matrix = new THREE.Matrix4();

    const rockGeometry = React.useMemo(()=>{
        const geometry = new THREE.IcosahedronGeometry(1, 1);
        const positions = geometry.attributes.position;
        const seed = Math.random()*1000;
        for (let i = 0; i < positions.count; i++){
            v3.fromBufferAttribute(positions, i);
            const noise = noise4D(v3.x, v3.y, v3.z, seed)
            v3.addScaledVector(v3, noise * 0.65);
            positions.setXYZ(i, v3.x, v3.y, v3.z)
        }
        return geometry;
    }, [])
    

    const puffGeometryColored = React.useMemo(() => {
        const geometry = rockGeometry
        const positions = geometry.attributes.position;
        geometry.setAttribute( 'color', new THREE.BufferAttribute( new Float32Array( positions.count * 3 ), 3 ) );
        const colors = geometry.attributes.color;
        const color = new THREE.Color();
        const seed = Math.random()*1000;
        let k = 0;
        for (let i = 0; i < positions.count/3; i++){
        
            const hex = colorVariation(colord(planet.ring.color), 0.2).toHex();
            color.set(hex);

            colors.setXYZ(i * 3 + 0, color.r, color.g, color.b);
            colors.setXYZ(i * 3 + 1, color.r, color.g, color.b);
            colors.setXYZ(i * 3 + 2, color.r, color.g, color.b);
        }
        return geometry;
    }, [rockGeometry, planet.ring.color])

    React.useEffect(()=>{
        const points: Array<THREE.Vector3> = [];
        const upVector = new THREE.Vector3(0, 1, 0);
        const y_offset = Math.sqrt(planet.radius) * 1.25;

        for (let i = 0; i < POINT_COUNT; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const x = Math.cos(angle) * (planet.radius + planet.ring.startDistance + planet.ring.width * Math.random() );
            const y = Math.sin(angle) * (planet.radius + planet.ring.startDistance + planet.ring.width * Math.random());
            
            v3.set(x, y, y_offset/2 - Math.random() * y_offset);

            const size = Math.random()*0.9 + 0.1;
            
            quaternion.setFromUnitVectors(upVector, new THREE.Vector3(Math.random(),Math.random(),Math.random()));
            matrix.compose(v3, quaternion, new THREE.Vector3((Math.random()*0.5 + 0.5) * size, (Math.random()*0.5 + 0.5) * size, (Math.random()*0.5 + 0.5) * size));
            meshRef.current?.setMatrixAt(i, matrix);
                    
        }


        if(meshRef.current){
            meshRef.current.count = POINT_COUNT;
            meshRef.current.instanceMatrix.needsUpdate = true;
        }

    }, [meshRef, POINT_COUNT])

    useEffect(()=>{
        if(innerGroupRef.current){
            innerGroupRef.current.rotation.set(planet.ring.tiltX, planet.ring.tiltY, 0);
        }
    },[planet.ring.tiltX, planet.ring.tiltY])

    useFrame(()=>{
        if(groupRef.current){
            const q2 = new THREE.Quaternion();
            q2.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), Math.PI/2 );

            groupRef.current.getWorldQuaternion(quaternion);
            
            quaternion.invert();
            
            const invertedWorldQuaternion = quaternion.premultiply(groupRef.current.quaternion).multiply(q2)
            groupRef.current.rotation.setFromQuaternion(invertedWorldQuaternion);
        }
        if(meshRef.current){
            let rotation = meshRef.current?.rotation;
            if(rotation) meshRef.current?.rotation.set(rotation.x, rotation.y, rotation.z + planet.ring.speed/400);
        }
    })
    return (
        <>
            <group ref={groupRef}>
                <group ref={innerGroupRef}>
                    <instancedMesh ref={meshRef} args={[puffGeometryColored, rockMaterial, POINT_COUNT]}></instancedMesh>
                </group>
            </group>
        </>
    )
}