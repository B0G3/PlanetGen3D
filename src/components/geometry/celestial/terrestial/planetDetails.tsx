import React from "react"
import TerrestialPlanet from "../../../../models/terrestialPlanet"
import * as THREE from "three";
import { MAX_PLANET_RADIUS } from "../../../../utils/constants";
import { colord } from "colord";
import { colorVariation } from "../../../../utils/helpers";

interface Props{
    planet: TerrestialPlanet,
    noiseValue: Function
}

export default function PlanetDetails({planet, noiseValue}: Props){
    const GEOMETRIES = React.useMemo(()=>({
        PINE_TRUNK_GEOMETRY: new THREE.CylinderGeometry(0.05, 0.05, 0.5, 5, 1),
        PINE_GEOMETRY: new THREE.ConeGeometry(0.25, 0.8, 5),
        OAK_TRUNK_GEOMETRY: new THREE.CylinderGeometry(0.05, 0.05, 0.75, 5, 1),
        OAK_GEOMETRY: new THREE.IcosahedronGeometry(0.25, 1),
        ROCK_GEOMETRY: new THREE.BoxGeometry(0.3, 0.3, 0.3)
    }), [])
    const MATERIAL_DARKEN = React.useMemo(() => new THREE.MeshBasicMaterial({ color: "#bfbfbf" }), []);
    const DECAL_TYPES = [
        {
            // PINE TREE
            density: 4,
            visible: (e : number) => {return( planet.enableVegetation && e >= planet.waterLevel + 0.25 && e <= planet.waterLevel + 0.9)}, 
            meshes: [
                {
                    ref: React.useRef<THREE.InstancedMesh>(null),
                    geometry: GEOMETRIES.PINE_GEOMETRY,
                    material: MATERIAL_DARKEN,
                    height_offset: 0.5,
                    color: {
                        hex: planet.colors.grass,
                        variation: 0.1
                    },
                    size_variation: 0.6,
                    randomize_rotation: false,
                },
                {
                    ref: React.useRef<THREE.InstancedMesh>(null),
                    geometry: GEOMETRIES.PINE_TRUNK_GEOMETRY,
                    material: MATERIAL_DARKEN,
                    height_offset: 0,
                    color: {
                        hex: planet.colors.grass,
                        variation: 0.1
                    },
                    size_variation: 0,
                    randomize_rotation: false,
                }
            ]
        },
        {
            // OAK TREE
            density: 2,
            visible: (e : number) => {return( planet.enableVegetation && e >= planet.waterLevel + 0.25 && e <= planet.waterLevel + 1)}, 
            meshes: [
                {
                    ref: React.useRef<THREE.InstancedMesh>(null),
                    geometry: GEOMETRIES.OAK_GEOMETRY,
                    material: MATERIAL_DARKEN,
                    height_offset: 0.5,
                    color: {
                        hex: planet.colors.grass,
                        variation: 0.1
                    },
                    size_variation: 1,
                    randomize_rotation: false,
                },
                {
                    ref: React.useRef<THREE.InstancedMesh>(null),
                    geometry: GEOMETRIES.OAK_TRUNK_GEOMETRY,
                    material: MATERIAL_DARKEN,
                    height_offset: 0,
                    color: {
                        hex: planet.colors.grass,
                        variation: 0.1
                    },
                    size_variation: 0.2,
                    randomize_rotation: false,
                }
            ]
        },
        {
            // ROCK
            density: 1,
            visible: (e : number) => {return true}, 
            meshes: [
                {
                    ref: React.useRef<THREE.InstancedMesh>(null),
                    geometry: GEOMETRIES.ROCK_GEOMETRY,
                    material: MATERIAL_DARKEN,
                    height_offset: -0.02,
                    color: {
                        hex: planet.colors.rock ?? "#ffffff",
                        variation: 0.1
                    },
                    size_variation: 1,
                    randomize_rotation: true,
                }
            ]
        }
    ];
    const RADIUS_MULTIPLIER = (1 - (MAX_PLANET_RADIUS - planet.radius)/MAX_PLANET_RADIUS);
    const MAX_DECAL_COUNT = 20000 * (1 - (10 - planet.detailCount)/10);
    
    const v3 = new THREE.Vector3();
    const color = new THREE.Color();
    const quaternion = new THREE.Quaternion();
    const matrix = new THREE.Matrix4();

    const fibonacciPoints = React.useMemo(()=>{
        const points = [];
        const NUM_POINTS = MAX_DECAL_COUNT * RADIUS_MULTIPLIER * RADIUS_MULTIPLIER;
        const yOffset = 2 / NUM_POINTS;
        const phi = Math.PI * (3.0 - Math.sqrt(5.0));
        for (let i = 0; i < NUM_POINTS; i++) {
            const y = i * yOffset - 1 + yOffset / 2;
            const r = Math.sqrt(1 - y * y);
            const theta = phi * i;
            const x = Math.cos(theta) * r;
            const z = Math.sin(theta) * r;
            const variation = Math.random() * 1 - 0.5;
            v3.set(x + variation, y + variation, z + variation).normalize();
            points.push(v3.clone());
        }
        return points;
    }, [RADIUS_MULTIPLIER, MAX_DECAL_COUNT]);

    const generateDecals = () => {
        // DECALS
        let j = 0;
        let noise = 0;
        const upVector = new THREE.Vector3(0, 1, 0);
        const decal_count : Array<number> = []
        let total_density : number = 0;
        DECAL_TYPES.forEach((d, k) => {
            decal_count[k] = 0;
            total_density += d.density;
        })

        fibonacciPoints.forEach((e, i) => {
            noise = noiseValue(e);
            v3.copy(e).multiplyScalar(planet.radius).addScaledVector(e, noise);
            let v3_length = v3.length();
            const point = v3.clone();

            // Generate random value from 1 to total density
            const density_threshold = Math.floor(Math.random() * total_density) + 1;
            let density_cumulative = 0;
            let loop = true;
            DECAL_TYPES.forEach((d, k) => {
                d.meshes.forEach(m => {
                    color.set(colorVariation(colord(m.color.hex)).toHex());
                    m.ref.current?.setColorAt(i, color);
                })
                density_cumulative += d.density;
                // Pick decal based on randomized density
                if (loop && density_cumulative >= density_threshold) {
                    if(d.visible(v3_length)){
                        
                        d.meshes.forEach(m => {
                            const size = 1 - m.size_variation/2 + m.size_variation * Math.random();
                            if(m.randomize_rotation) quaternion.setFromUnitVectors(upVector, new THREE.Vector3(Math.random(),Math.random(),Math.random()));
                            else quaternion.setFromUnitVectors(upVector, point.normalize());
                            
                            matrix.compose(v3.setLength(v3_length + m.height_offset), quaternion, new THREE.Vector3(size, size, size));
                        
                            if(m.ref && m.ref.current) {
                                m.ref.current.setMatrixAt(decal_count[k], matrix);
                            }
                        })
                        decal_count[k] = decal_count[k] + 1;
                    }
                    
                    loop = false;
                }
            })
        })

        DECAL_TYPES.forEach((d, k) => {
            d.meshes.forEach(m => {
                if(m.ref && m.ref.current) {
                    m.ref.current.count = decal_count[k];
                    m.ref.current.instanceMatrix.needsUpdate = true;
                    if(m.ref.current.instanceColor) m.ref.current.instanceColor.needsUpdate = true;
                }
            })
        })
    }

    React.useEffect(()=>{
        generateDecals();
    }, [planet.enableVegetation, planet.detailCount, planet.waterLevel, planet.steepness, planet.mountainousness, planet.colors.grass, planet.colors.rock])


    return (
        <>
                {DECAL_TYPES.map((d, i) => (
                    d.meshes.map((m, j) => (
                        <instancedMesh
                        key={`decal-${i}-${j}`}
                        ref={m.ref}
                        args={[m.geometry, m.material, fibonacciPoints.length]}
                        ></instancedMesh>
                    ))
                ))}
            
        </>
    );
}
