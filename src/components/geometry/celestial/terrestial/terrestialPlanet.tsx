import React from "react";
import TerrestialPlanet from "../../../../models/terrestialPlanet"
import * as THREE from "three";
import { createNoise4D } from "simplex-noise";
import { calculateSphereSurfaceArea, colorVariation, getIcosahedronDetail } from "../../../../utils/helpers";
import { MAX_PLANET_MOUNTAINOUSNESS, MAX_PLANET_RADIUS, MAX_PLANET_STEEPNESS } from "../../../../utils/constants";
import { colord } from "colord";
import PlanetWater from "./planetWater";
import PlanetDetails from "./planetDetails";
const noise4D = createNoise4D();

interface Props{
    planet: TerrestialPlanet
}

const geometries = {
    PINE_TRUNK_GEOMETRY: new THREE.CylinderGeometry(0.05, 0.05, 0.5, 5, 1),
    PINE_GEOMETRY: new THREE.ConeGeometry(0.25, 0.8, 5),
    OAK_TRUNK_GEOMETRY: new THREE.CylinderGeometry(0.05, 0.05, 0.75, 5, 1),
    OAK_GEOMETRY: new THREE.IcosahedronGeometry(0.25, 1),
    ROCK_GEOMETRY: new THREE.BoxGeometry(0.3, 0.3, 0.3)
}


export default function Planet({planet} : Props){
    const MAX_HEIGHT = planet.radius * 1.5;
    const DETAIL = getIcosahedronDetail(planet.radius, 0.5)
    const RADIUS_MULTIPLIER = (1 - (MAX_PLANET_RADIUS - planet.radius)/MAX_PLANET_RADIUS);
    const STEPNESS_MULTIPLIER = (1 - (MAX_PLANET_STEEPNESS - planet.steepness)/MAX_PLANET_STEEPNESS);
    const MOUNTAINOUSNESS_MULTIPLIER = (1 - (MAX_PLANET_MOUNTAINOUSNESS - planet.mountainousness)/MAX_PLANET_MOUNTAINOUSNESS)*(planet.radius/MAX_PLANET_RADIUS);
    const NOISE_FREQUENCY = STEPNESS_MULTIPLIER * 1.25 * RADIUS_MULTIPLIER + 0.5;
    const SEED = React.useMemo(() => Math.random()*1000, []);

    const color = new THREE.Color();
    const v3 = new THREE.Vector3();
    const vertA = new THREE.Vector3();
    const vertB = new THREE.Vector3();
    const vertC = new THREE.Vector3();

    const getNoiseValue = (vector : THREE.Vector3) => {
        let noise = 0;
        noise = 1 * noise4D(vector.x * NOISE_FREQUENCY, vector.y * NOISE_FREQUENCY, vector.z * NOISE_FREQUENCY, SEED);
        noise += 0.5 * noise4D(vector.x * NOISE_FREQUENCY * 2, vector.y * NOISE_FREQUENCY * 2, vector.z * NOISE_FREQUENCY * 2, SEED);
        noise += 0.25 * noise4D(vector.x * NOISE_FREQUENCY * 4, vector.y * NOISE_FREQUENCY * 4, vector.z * NOISE_FREQUENCY * 4, SEED);
        noise *= (MOUNTAINOUSNESS_MULTIPLIER ) * 8;
        
        if(noise <= 0.125) noise -= 0.25;

        return Math.round(noise * 4) / 4;
    }

    const updateColors = (geometry: THREE.BufferGeometry) => {
        const positions = geometry.attributes.position;
        const colors = geometry.attributes.color;
        for (let i = 0; i < positions.count/3; i++ ) {

            v3.fromBufferAttribute(positions, i).normalize();
            vertA.fromBufferAttribute(positions, i * 3 + 0);
            vertB.fromBufferAttribute(positions, i * 3 + 1);
            vertC.fromBufferAttribute(positions, i * 3 + 2);
            const vertA_length = vertA.length();
            const vertB_length = vertB.length();
            const vertC_length = vertC.length();
            const shortest = Math.min(vertA_length, vertB_length, vertC_length);
            const longest = Math.max(vertA_length, vertB_length, vertC_length);
            if(shortest < planet.waterLevel + 0.125 ){ 
                if(longest < planet.waterLevel - 1) color.set(planet.colors.getVariant('deep_sand'));
                else color.set(planet.colors.getVariant('sand'));
            }
            else if(shortest < planet.waterLevel + 0.9 ) color.set(planet.colors.getVariant('grass'));
            else if(shortest < planet.waterLevel + 1.75 ) color.set(planet.colors.getVariant('rock'));
            else color.set(planet.colors.getVariant('ice'));


            colors.setXYZ(i * 3, color.r, color.g, color.b);
            colors.setXYZ(i * 3 + 1, color.r, color.g, color.b);
            colors.setXYZ(i * 3 + 2, color.r, color.g, color.b);
        }
        colors.needsUpdate = true;
    }

    const planetGeometry = React.useMemo(()=>{
        const geometry = new THREE.IcosahedronGeometry(planet.radius, DETAIL);
        const positions = geometry.attributes.position;
        geometry.setAttribute( 'color', new THREE.BufferAttribute( new Float32Array( positions.count * 3 ), 3 ) );
        
        const basePosition = new THREE.Vector3(); 
        let noise = 0;
        let k = 0;
        for (let i = 0; i < positions.count; i++ ) {

            basePosition.fromBufferAttribute(positions, i).normalize();
            noise = getNoiseValue(basePosition);

            v3.copy(basePosition).multiplyScalar(planet.radius).addScaledVector(basePosition, noise + 0.01);
            v3.clampLength(-planet.radius/2, MAX_HEIGHT)
            positions.setXYZ(i, v3.x, v3.y, v3.z);

        }
        geometry.attributes.position.needsUpdate = true;

        updateColors(geometry);

        return geometry;

    },[DETAIL, planet.waterLevel, planet.steepness, planet.mountainousness])


    React.useEffect(()=>{ // Update colors only
        const geometry = planetGeometry;
        updateColors(geometry);
    }, [planet.colors.needsUpdate])

    return (
        <group>
                <mesh frustumCulled={false}>
                    <primitive object={planetGeometry} attach="geometry"></primitive>
                    <meshBasicMaterial
                        attach="material" 
                        vertexColors={ true }
                    />
                </mesh>
                { planet.enableWater &&
                    <PlanetWater planet={planet} noiseValue={getNoiseValue}></PlanetWater>
                }
                <PlanetDetails planet={planet} noiseValue={getNoiseValue}></PlanetDetails>
        </group>
       
    )
}