import React from "react";
import TerrestialPlanet from "../../../../models/terrestialPlanet"
import * as THREE from "three";
import { getIcosahedronDetail } from "../../../../utils/helpers";

interface Props{
    planet: TerrestialPlanet,
    noiseValue: Function
}

export default function PlanetWater({planet, noiseValue}: Props){
    const DETAIL = getIcosahedronDetail(planet.waterLevel, 0.5);
    const color = new THREE.Color();
    const v3 = new THREE.Vector3();

    const waterGeometry = React.useMemo(()=>{
        const geometry = new THREE.IcosahedronGeometry(Math.round(planet.waterLevel*4)/4 + 0.125, DETAIL);
        const positions = geometry.attributes.position;
        geometry.setAttribute( 'color', new THREE.BufferAttribute( new Float32Array( positions.count * 3 ), 3 ) );
       
        let colors = geometry.attributes.color;
        colors = geometry.attributes.color;
        let k = 0;
        for ( let i = 0; i < positions.count; i ++ ) {
            if(i%3===0){
                v3.fromBufferAttribute(positions, i).normalize();
                const noise = noiseValue(v3);
                const v3_2 = new THREE.Vector3();
                v3_2.copy(v3).multiplyScalar(planet.radius).addScaledVector(v3, noise).length();

                if(v3_2.length() + 0.5 >= planet.waterLevel) color.set(planet.colors.computed.water[1]);
                // else if(v3_2.length() + 1 > planet.waterLevel) color.set(planet.colors.computed.water[1]);
                else color.set(planet.colors.computed.water[2]);

                colors.setXYZ(k * 3 + 0, color.r, color.g, color.b);
                colors.setXYZ(k * 3 + 1, color.r, color.g, color.b);
                colors.setXYZ(k * 3 + 2, color.r, color.g, color.b);
                k++;
            }
        }

        geometry.attributes.position.needsUpdate = true;
        colors.needsUpdate = true;
        return geometry;
    }, [planet.radius, planet.waterLevel, planet.mountainousness, planet.steepness, planet.colors.needsUpdate])

    return (
        <>
            <mesh>
                <primitive object={waterGeometry} attach="geometry"></primitive>
                <meshBasicMaterial
                    attach="material" 
                    vertexColors={true}
                    transparent={true} 
                    opacity={0.85}
                />
            </mesh>
        </>
    )
}