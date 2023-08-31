import React from "react";
import TerrestialPlanet from "../../../models/terrestialPlanet"
import * as THREE from "three";
import { createNoise4D } from "simplex-noise";
import { calculateSphereSurfaceArea } from "../../../utils/helpers";
import { MAX_PLANET_MOUNTAINOUSNESS, MAX_PLANET_RADIUS, MAX_PLANET_STEEPNESS } from "../../../utils/constants";
import hexColor from "../../../types/hexColor";
const noise4D = createNoise4D();
const Color = require('color');

interface Props{
    planet: TerrestialPlanet
}

export default function Planet({planet} : Props){
    const color = new THREE.Color();
    const seed = React.useMemo(() => Math.random()*100000, []);
    const RADIUS = planet.radius + 4;
    const STEPNESS_MULTIPLIER = (1 - (MAX_PLANET_STEEPNESS - planet.steepness)/MAX_PLANET_STEEPNESS);
    const MOUNTAINOUSNESS_MULTIPLIER = (1 - (MAX_PLANET_MOUNTAINOUSNESS - planet.mountainousness)/MAX_PLANET_MOUNTAINOUSNESS)*(planet.radius/MAX_PLANET_RADIUS);
    const MAX_HEIGHT = planet.radius * 1.5
    const icosahedronGeometry = React.useMemo(() => new THREE.IcosahedronGeometry(RADIUS, RADIUS), [RADIUS]);
    const [basePositions, setBasePositions] = React.useState<Array<THREE.Vector3>>([]);
    let v3 = new THREE.Vector3();

    React.useEffect(()=>{
        const arr = [];
        const positions = icosahedronGeometry.attributes.position;
        // console.log(positions);
        console.log(icosahedronGeometry.attributes.position.count);
        
        for (let i = 0; i < positions.count; i++){
            v3.fromBufferAttribute(positions, i).normalize();
            arr.push(v3.clone());
        }
        setBasePositions(arr);
    }, [icosahedronGeometry])

    React.useEffect(()=>{
        // console.log(basePositions);
        generatePlanet();
    }, [basePositions, planet.waterLevel, planet.mountainousness, planet.steepness])

    const colorVariation = (hex : hexColor, variation = 0.1) => {
        const random = Math.random() * variation - variation/2;
        return Color(hex).lighten(random).rgbNumber();
    }

    const generatePlanet = () => {
        const positions = icosahedronGeometry.attributes.position;
        icosahedronGeometry.setAttribute( 'color', new THREE.BufferAttribute( new Float32Array( positions.count * 3 ), 3 ) );
        const colors = icosahedronGeometry.attributes.color;
        
        const noise_frequency = STEPNESS_MULTIPLIER + 0.5;
        for ( let i = 0; i < positions.count; i ++ ) {
            if(!basePositions[i]) return;
            
            // const simplex = 
            let noise = 1 * noise4D(basePositions[i].x * noise_frequency, basePositions[i].y * noise_frequency, basePositions[i].z * noise_frequency, seed);
            noise += 0.5 * noise4D(basePositions[i].x * noise_frequency * 2, basePositions[i].y * noise_frequency * 2, basePositions[i].z * noise_frequency * 2, seed);
            noise += 0.25 * noise4D(basePositions[i].x * noise_frequency * 4, basePositions[i].y * noise_frequency * 4, basePositions[i].z * noise_frequency * 4, seed);
            
            noise *= (MOUNTAINOUSNESS_MULTIPLIER + 1) * 1.5;

            v3.copy(basePositions[i]).multiplyScalar(planet.radius).addScaledVector(basePositions[i], noise);
            v3.clampLength(-planet.radius/2, MAX_HEIGHT)
            positions.setXYZ(i, v3.x, v3.y, v3.z);
        }

        const vertA = new THREE.Vector3();
        const vertB = new THREE.Vector3();
        const vertC = new THREE.Vector3();
        const center = new THREE.Vector3();
        const face = new THREE.Triangle();

        for ( let i = 0; i < positions.count / 3; i ++ ) {
            let isWater = false;
            vertA.fromBufferAttribute(positions, i * 3);
            vertB.fromBufferAttribute(positions, i * 3 + 1);
            vertC.fromBufferAttribute(positions, i * 3 + 2);
            face.set(vertA, vertB, vertC);
            face.getMidpoint(center);
            const vertA_length = vertA.length();
            const vertB_length = vertB.length();
            const vertC_length = vertC.length();
            const shortest = Math.min(vertA_length, vertB_length, vertC_length);

            if(vertA_length < planet.waterLevel + 0.1 ){
                vertA.setLength(Math.max(vertA_length - 0.2, planet.radius/2));
                positions.setXYZ(i * 3, vertA.x, vertA.y, vertA.z);
            }
            if(vertB_length < planet.waterLevel + 0.1 ){
                vertB.setLength(Math.max(vertB_length - 0.2, planet.radius/2));
                positions.setXYZ(i * 3 + 1, vertB.x, vertB.y, vertB.z);
            }
            if(vertC_length < planet.waterLevel + 0.1 ){
                vertC.setLength(Math.max(vertC_length - 0.2, planet.radius/2));
                positions.setXYZ(i * 3 + 2, vertC.x, vertC.y, vertC.z);
            }

            face.getMidpoint(center);

            if(!planet.colors) return;
            if(shortest <= planet.waterLevel + 0.1 ) color.setHex(colorVariation(planet.colors.sand, 0.2));
            else if(shortest <= planet.waterLevel + 0.75 ) color.setHex(colorVariation(planet.colors.grass));
            else if(shortest <= planet.waterLevel + 1.75 ) color.setHex(colorVariation(planet.colors.rock, 0.05))
            else color.setHex(colorVariation(planet.colors.ice, 0.25))


            colors.setXYZ(i * 3, color.r, color.g, color.b);
            colors.setXYZ(i * 3 + 1, color.r, color.g, color.b);
            colors.setXYZ(i * 3 + 2, color.r, color.g, color.b);
        }
        colors.needsUpdate = true;
        icosahedronGeometry.attributes.position.needsUpdate = true;
    }
    
  

    return (
        <>
         <mesh>
            <primitive object={icosahedronGeometry} attach="geometry"></primitive>
            <meshBasicMaterial
                // wireframe={true}
                attach="material" 
                // color="red"
                vertexColors={ true }
            />
        </mesh>
        <mesh>
            <icosahedronGeometry args={[planet.waterLevel, 8]}/>
            <meshBasicMaterial
                        // wireframe={true}
                        attach="material" color="blue"
                        transparent={true} opacity={0.75}
            />
        </mesh>
        </>
       
    )
}