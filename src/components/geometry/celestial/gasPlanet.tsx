import React from "react";
import * as THREE from "three";
import GasPlanetModel from "../../../models/gasPlanet";
import { colorVariation, getIcosahedronDetail } from "../../../utils/helpers";
import { MAX_PLANET_RADIUS } from "../../../utils/constants";
import { createNoise4D } from "simplex-noise";
import { colord, random } from "colord";
const noise4D = createNoise4D();
interface Props{
    planet: GasPlanetModel
}
export default function GasPlanet({planet} : Props){
    const GAS_DETAIL = getIcosahedronDetail(planet.radius, 1/8);
    const CORE_DETAIL = getIcosahedronDetail(planet.coreRadius);
    const CORE_RADIUS_MULTIPLIER = (1 - ((MAX_PLANET_RADIUS*2) - planet.coreRadius)/(MAX_PLANET_RADIUS*2));
    const CORE_NOISE_FREQUENCY = CORE_RADIUS_MULTIPLIER + 0.5;
    const SEED = React.useMemo(() => Math.random()*1000, []);
    const v3 = new THREE.Vector3();
    const color = new THREE.Color();

    const getNoiseValue = (vector : THREE.Vector3) => {
        let noise = 0;
        noise = 1 * noise4D(vector.x * CORE_NOISE_FREQUENCY, vector.y * CORE_NOISE_FREQUENCY, vector.z * CORE_NOISE_FREQUENCY, SEED);
        noise += 0.5 * noise4D(vector.x * CORE_NOISE_FREQUENCY * 2, vector.y * CORE_NOISE_FREQUENCY * 2, vector.z * CORE_NOISE_FREQUENCY * 2, SEED);
        // noise += 0.25 * noise4D(vector.x * CORE_NOISE_FREQUENCY * 4, vector.y * CORE_NOISE_FREQUENCY * 4, vector.z * CORE_NOISE_FREQUENCY * 4, SEED);
        return noise * 0.75;
    }

    const [gasGeometry, startPositions] = React.useMemo(() => {
        const arr = [];
        const geometry =  new THREE.IcosahedronGeometry(planet.radius, GAS_DETAIL);
        const positions = geometry.attributes.position;
        geometry.setAttribute( 'color', new THREE.BufferAttribute( new Float32Array( positions.count * 3 ), 3 ) );
        const colors = geometry.attributes.color;

        const vertA = new THREE.Vector3();
        const vertB = new THREE.Vector3();
        const vertC = new THREE.Vector3();
        let k = 0;

        for (let i = 0; i < positions.count; i++){
            v3.fromBufferAttribute(positions, i).normalize();
            arr.push(v3.clone());

            if(i%3 === 2){
                vertA.fromBufferAttribute(positions, k * 3 + 0);
                vertB.fromBufferAttribute(positions, k * 3 + 1);
                vertC.fromBufferAttribute(positions, k * 3 + 2);
                const lowestZ = Math.min(vertA.z, vertB.z, vertC.z);
                // console.log(lowestZ);
                
                // if(v3.z > -0.5 && v3.z < 0.5 ) color.set(colord(planet.coreColor).darken(1).toHex());
                color.set(colord(planet.coreColor).lighten((planet.radius/4-Math.abs(lowestZ))/(planet.radius/4)).toHex());
                // color.set(colorVariation(colord(planet.coreColor), 0.05).toHex())
                colors.setXYZ(k * 3, color.r, color.g, color.b);
                colors.setXYZ(k * 3 + 1, color.r, color.g, color.b);
                colors.setXYZ(k * 3 + 2, color.r, color.g, color.b);
                k++;
            }
        }
        return [geometry, arr];

    }, [GAS_DETAIL]);

    const coreGeometry = React.useMemo(() => {
        const geometry = new THREE.IcosahedronGeometry(planet.coreRadius, CORE_DETAIL);
        const positions = geometry.attributes.position;
        geometry.setAttribute( 'color', new THREE.BufferAttribute( new Float32Array( positions.count * 3 ), 3 ) );
        const colors = geometry.attributes.color;
        const basePosition = new THREE.Vector3(); 
        let noise = 0;
        let k = 0;
        for (let i = 0; i < positions.count; i++ ) {

            basePosition.fromBufferAttribute(positions, i).normalize();
            noise = getNoiseValue(basePosition);
            const part = Math.round(noise * 4) / 4; // round to every 0.25

            v3.copy(basePosition).multiplyScalar(planet.coreRadius).addScaledVector(basePosition, part);
            positions.setXYZ(i, v3.x, v3.y, v3.z);

            if(i%3 === 2){
                color.set(colorVariation(colord(planet.coreColor), 0.05).toHex())
                colors.setXYZ(k * 3, color.r, color.g, color.b);
                colors.setXYZ(k * 3 + 1, color.r, color.g, color.b);
                colors.setXYZ(k * 3 + 2, color.r, color.g, color.b);
                k++;
            }

        }
        colors.needsUpdate = true;
        geometry.attributes.position.needsUpdate = true;

        return geometry;
    }, [CORE_DETAIL]);

    return (
        <group>
            <mesh>
                <primitive object={coreGeometry} attach="geometry"></primitive>
                <meshBasicMaterial
                        side={THREE.FrontSide}
                        attach="material"
                        vertexColors={ true }
                />
            </mesh>
            <mesh>
                <primitive object={gasGeometry} attach="geometry"></primitive>
                <meshBasicMaterial
                        side={THREE.FrontSide}
                        attach="material"
                        vertexColors={ true }
                        opacity={0.95}
                        transparent={true}
                />
            </mesh>
        </group>)
}