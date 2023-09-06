import React, { useEffect } from "react";
import Star from "../../models/star";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { createNoise4D } from "simplex-noise";
import { MAX_STAR_RADIUS } from "../../utils/constants";
import { colord } from "colord";
const noise4D = createNoise4D();

export default function({star} : {star: Star}){
    const DETAIL = Math.ceil((star.radius * 5) / Math.sqrt(3) / 24);
    const RADIUS_MULTIPLIER = (1 - (MAX_STAR_RADIUS - star.radius)/MAX_STAR_RADIUS);
    
    const ref = React.useRef<THREE.Mesh | null>(null)
    const [count, setCount] = React.useState(0);
    const [startPositions, setStartPositions] = React.useState<Array<THREE.Vector3>>([]);
    const color = new THREE.Color();
    const v3 = new THREE.Vector3();


    useEffect(()=>{
        if(!ref.current) return;
        const arr = [];
        const geometry = ref.current.geometry;
        const positions = geometry.attributes.position;
        
        for (let i = 0; i < positions.count; i++){
            v3.fromBufferAttribute(positions, i).normalize();
            arr.push(v3.clone());
        }
        setStartPositions(arr);

    }, [ref.current, star.radius])

    useFrame((state, delta, xrFrame)=>{
        if(!ref.current) return;
        if(!startPositions.length) return;
        setCount(count + delta);

        const geometry = ref.current.geometry;
        const positions = geometry.attributes.position;
    
        let colors = geometry.attributes.color;
        if(!colors){
            geometry.setAttribute( 'color', new THREE.BufferAttribute( new Float32Array( positions.count * 3 ), 3 ) );
            colors = geometry.attributes.color;
        }

        let k = 0;
        for ( let i = 0; i < positions.count; i ++ ) {
            if(!startPositions[i]) return;
            const noise = noise4D(startPositions[i].x, startPositions[i].y, startPositions[i].z, count) * (star.fluctuations + 0.25);
            const tenth = Math.round(noise * 20) / 20
            const hex = colord(star.color).darken(tenth/4).toHex();
            color.set(hex);
            

            if(i%3===0){
                colors.setXYZ(k * 3 + 0, color.r, color.g, color.b);
                colors.setXYZ(k * 3 + 1, color.r, color.g, color.b);
                colors.setXYZ(k * 3 + 2, color.r, color.g, color.b);
                k++;
            }
            
            v3.copy(startPositions[i]).multiplyScalar(star.radius).addScaledVector(startPositions[i], noise * RADIUS_MULTIPLIER * 2);
            positions.setXYZ(i, v3.x, v3.y, v3.z)

        }

        geometry.attributes.position.needsUpdate = true;
        
        colors.needsUpdate = true;
    })

    return (
        <group>
            <mesh ref={ref}>
                <icosahedronGeometry args={[star.radius, DETAIL]}></icosahedronGeometry>
                <meshBasicMaterial
                        // color={star.color}
                        side={THREE.FrontSide}
                        attach="material"
                        vertexColors={ true }
                        // transparent={true}
                        // opacity={0.85}
                />
            </mesh>
        </group>

    )
}