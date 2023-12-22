import React, { useEffect } from "react";
import Star from "../../../models/star";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { createNoise4D } from "simplex-noise";
import { MAX_STAR_RADIUS } from "../../../utils/constants";
import { colord } from "colord";
import { getIcosahedronDetail } from "../../../utils/helpers";
const noise4D = createNoise4D();

export default function({star} : {star: Star}){
    const COLOR_COUNT = 12;
    const part = (1 / (COLOR_COUNT/2)) / 2;
    const TINTS = React.useMemo(()=>{
        const tints = [];
        for(let i = Math.floor(COLOR_COUNT/2); i > 0; i--){
            tints.push(colord(star.color).darken(i*part).toHex())
        }

        for(let i = Math.floor(COLOR_COUNT/2); i < COLOR_COUNT; i++){
            tints.push(colord(star.color).darken(-(i - (COLOR_COUNT/2))*part).toHex())
        }
        return tints;
    }, [star.color, star.fluctuations]);
    const DETAIL = getIcosahedronDetail(star.radius, 1/16);
    const RADIUS_MULTIPLIER = (1 - (MAX_STAR_RADIUS - star.radius)/MAX_STAR_RADIUS);
    const [count, setCount] = React.useState(0);
    const color = new THREE.Color();
    const v3 = new THREE.Vector3();

    const [starGeometry, startPositions] = React.useMemo(() => {
        const arr = [];
        const geometry =  new THREE.IcosahedronGeometry(star.radius, DETAIL);
        const positions = geometry.attributes.position;
        geometry.setAttribute( 'color', new THREE.BufferAttribute( new Float32Array( positions.count * 3 ), 3 ) );

        for (let i = 0; i < positions.count; i++){
            v3.fromBufferAttribute(positions, i).normalize();
            arr.push(v3.clone());
        }
        return [geometry, arr];

    }, [DETAIL]);


    useFrame((state, delta, xrFrame)=>{
        if(!starGeometry || !startPositions) return;
        setCount(count + delta);

        const geometry = starGeometry;
        const positions = geometry.attributes.position;
    
        let colors = geometry.attributes.color;
        let k = 0;
        for ( let i = 0; i < positions.count; i ++ ) {
            if(!startPositions[i]) return;
            const noise = noise4D(startPositions[i].x, startPositions[i].y, startPositions[i].z, count) * (star.fluctuations + 0.25);
            const part = Math.round(noise * (COLOR_COUNT/2)) / (COLOR_COUNT/2);

            if(i%3===2){
                const fluctuations = Math.max(star.fluctuations, 0.5)
                const normalizedValue = (noise / (fluctuations + 0.25) + 1 ) / 2;

                const mappedValue = Math.floor(normalizedValue * COLOR_COUNT);
                color.set(TINTS[mappedValue]);

                colors.setXYZ(k * 3 + 0, color.r, color.g, color.b);
                colors.setXYZ(k * 3 + 1, color.r, color.g, color.b);
                colors.setXYZ(k * 3 + 2, color.r, color.g, color.b);
                k++;
            }
            
            v3.copy(startPositions[i]).multiplyScalar(star.radius).addScaledVector(startPositions[i], part * RADIUS_MULTIPLIER * 4);
            positions.setXYZ(i, v3.x, v3.y, v3.z)
        }

        geometry.attributes.position.needsUpdate = true;
        colors.needsUpdate = true;
    })

    return (
        <group>
            {/* <pointLight castShadow={true} decay={0} distance={200 + 25 *star.radius} power={15 * Math.sqrt(star.radius)} color={star.color} /> */}
            <mesh>
                <primitive object={starGeometry} attach="geometry"></primitive>
                <meshBasicMaterial
                        side={THREE.FrontSide}
                        attach="material"
                        vertexColors={ true }
                />
            </mesh>
        </group>

    )
}