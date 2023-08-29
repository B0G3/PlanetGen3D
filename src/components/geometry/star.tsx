import React from "react";
import Star from "../../models/star";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
const Color = require('color');

export default function({star} : {star: Star}){
    const ref = React.useRef<THREE.Mesh | null>(null)
    const [count, setCount] = React.useState(0);
    // const [initialPositions, setInitialPositions] = React.useState<Uint8Array>(new Uint8Array())



    useFrame((state, delta, xrFrame)=>{
        if(!ref.current) return;
        setCount(count+1);
        if(count%4!=0) return;

        const geometry = ref.current.geometry;
        const positionCount = geometry.attributes.position.count;
        const positions = geometry.attributes.position.array;
    
        const variation = 1;
        
        let colors = geometry.attributes.color;
        if(!colors){
            geometry.setAttribute( 'color', new THREE.BufferAttribute( new Float32Array( positionCount * 3 ), 3 ) );
            colors = geometry.attributes.color;
        }
        const color = new THREE.Color();
        const waveFrequency = 0.1; // Adjust the frequency of the wave
        const waveAmplitude = 0.2; // Adjust the amplitude of the wave

        for ( let i = 0; i < positionCount; i ++ ) {
            const variation = Math.cos(i + count * 0.05) / 4 + 0.5;
            const rgb : Array<number> = Color(star.color).darken(variation).rgb().array();
            
            color.setRGB(rgb[0]/255, rgb[1]/255, rgb[2]/255);
            colors.setXYZ(i * 3 + 0, color.r, color.g, color.b);
            colors.setXYZ(i * 3 + 1, color.r, color.g, color.b);
            colors.setXYZ(i * 3 + 2, color.r, color.g, color.b);
        }

        geometry.attributes.position.needsUpdate = true;
        
        colors.needsUpdate = true;
    })

    return (
        <mesh ref={ref}>
            <icosahedronGeometry  args={[star.radius, 6]}></icosahedronGeometry>
            <meshBasicMaterial
            // wireframe={true}
                    side={THREE.DoubleSide}
                    attach="material"
                    //  color={star.color}
                    vertexColors={ true }
            />
        </mesh>
    )
}