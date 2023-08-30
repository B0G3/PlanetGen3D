import React, { useEffect } from "react";
import Star from "../../models/star";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { createNoise4D } from "simplex-noise";
import hexColor from "../../types/hexColor";
const Color = require('color');
const noise4D = createNoise4D();

export default function({star} : {star: Star}){
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

        for ( let i = 0; i < positions.count; i ++ ) {
            if(!startPositions[i]) return;
            const noise = noise4D(startPositions[i].x, startPositions[i].y, startPositions[i].z, count) * star.fluctuations;
            const hex = Color(star.color).darken(noise * 0.5).rgbNumber();
            color.setHex(hex);

            colors.setXYZ(i * 3 + 0, color.r, color.g, color.b);
            colors.setXYZ(i * 3 + 1, color.r, color.g, color.b);
            colors.setXYZ(i * 3 + 2, color.r, color.g, color.b);
            
        
            v3.copy(startPositions[i]).multiplyScalar(star.radius).addScaledVector(startPositions[i], noise);
            positions.setXYZ(i, v3.x, v3.y, v3.z)

        }

        geometry.attributes.position.needsUpdate = true;
        
        colors.needsUpdate = true;
    })

    return (
        <mesh ref={ref}>
            <icosahedronGeometry args={[star.radius, Math.ceil(Math.sqrt(star.radius))]}></icosahedronGeometry>
            <meshBasicMaterial
                    // color={star.color}
                    side={THREE.DoubleSide}
                    attach="material"
                    vertexColors={ true }
            />
        </mesh>
    )
}