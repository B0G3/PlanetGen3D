import React, { useEffect, useState, useRef, useMemo } from 'react';
import { MAX_PLANET_MOUNTAINOUSNESS, MAX_PLANET_RADIUS, MAX_PLANET_STEEPNESS } from '../../../utils/constants';
import * as THREE from 'three';
const Color = require('color');

function colorVariation(hex, variation = 0.1){
    const random = Math.random() * variation - variation/2;
    if(random > 0) return Color(hex).lighten(random).hex();
    else return Color(hex).darken(-random).hex();
}

export default function PlanetTile({points, indices, planet}){
    const MAX_HEIGHT = planet.radius * 1.5
    const mesh = useRef(null);
    const render = true;
    const [mutated_points, is_water, center_local, height] = useMemo(() => {
        const STEPNESS_MULTIPLIER = (1 - (MAX_PLANET_STEEPNESS - planet.steepness)/MAX_PLANET_STEEPNESS);
        const MOUNTAINOUSNESS_MULTIPLIER = (1 - (MAX_PLANET_MOUNTAINOUSNESS - planet.mountainousness)/MAX_PLANET_MOUNTAINOUSNESS)*(planet.radius/MAX_PLANET_RADIUS);

        let sumX = 0;
        let sumY = 0;
        let sumZ = 0;
        let height = 0;
        let diff = new THREE.Vector3();
        let center = new THREE.Vector3();
        let isWater = true;

        let positions =  points.map(e => {
            let position = new THREE.Vector3(...e.position);
            let perlin = e.perlin;
            perlin += MOUNTAINOUSNESS_MULTIPLIER * Math.pow(perlin * 10, 3) / 100;
            perlin *= STEPNESS_MULTIPLIER * 1.5;

            diff.subVectors( center, position ).normalize().multiplyScalar(1 + perlin);
            diff.clampLength(-planet.radius/2, MAX_HEIGHT)
            position.add(diff)
            let vector_length = position.length();
            if(vector_length - planet.waterLevel < 0.1) position.setLength(planet.waterLevel);
            if(vector_length > MAX_HEIGHT) position.setLength(MAX_HEIGHT);
            if(vector_length > planet.waterLevel) isWater = false;

            sumX += position.x; // x-coordinate
            sumY += position.y; // y-coordinate
            sumZ += position.z; // z-coordinate

            height += position.length();

            return position;
        });

        const centerX = sumX / points.length;
        const centerY = sumY / points.length;
        const centerZ = sumZ / points.length;

        height = height / points.length;

        return [positions, isWater, [centerX, centerY, centerZ], height];
    }, [points, planet.steepness, planet.waterLevel, planet.mountainousness])
    const points_32 = useMemo(()=> new Float32Array(mutated_points.reduce((prev, val) => {
        return [...prev, val.x, val.y, val.z]
    }, [])),[mutated_points])
    const color = useMemo(()=>{
        if(is_water) return planet.colors.water

        if (height > planet.waterLevel + 1.2) return colorVariation(planet.colors.ice);
        else if (height > planet.waterLevel + 0.4) return colorVariation(planet.colors.rock);
        else if (height > planet.waterLevel + 0.025) return colorVariation(planet.colors.grass);
        return colorVariation(planet.colors.sand, 0.2)

    }, [height, planet.waterLevel])


    useEffect(() => {
        if(!render) return;
        mesh.current.geometry.setIndex( new THREE.BufferAttribute( indices, 1 ) );
        mesh.current.geometry.setAttribute( 'position', new THREE.BufferAttribute( points_32, 3 ) );
        mesh.current.geometry.attributes.position.needsUpdate = true;
        
    }, [mutated_points, render])

    // useFrame((state, delta) => {
    //     if(is_water){

    //     }
    // })

    return(
        <mesh ref={mesh}>
            {render && 
             <>
                <bufferGeometry attach="geometry"/>    
                <meshBasicMaterial
                    side={THREE.DoubleSide}
                    attach="material" color={color}
                />
            </>}
        </mesh>
    )
}