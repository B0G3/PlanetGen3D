import React from "react";
import TerrestialPlanet from "../../models/terrestialPlanet"
import * as THREE from "three";
import { createNoise4D } from "simplex-noise";
import { calculateSphereSurfaceArea, colorVariation } from "../../utils/helpers";
import { MAX_PLANET_MOUNTAINOUSNESS, MAX_PLANET_RADIUS, MAX_PLANET_STEEPNESS } from "../../utils/constants";
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
    const RADIUS = planet.radius;
    const MAX_HEIGHT = planet.radius * 1.5;
    const DETAIL = Math.ceil((RADIUS * 5) / Math.sqrt(3));
    const RADIUS_MULTIPLIER = (1 - (MAX_PLANET_RADIUS - planet.radius)/MAX_PLANET_RADIUS);
    const STEPNESS_MULTIPLIER = (1 - (MAX_PLANET_STEEPNESS - planet.steepness)/MAX_PLANET_STEEPNESS);
    const MOUNTAINOUSNESS_MULTIPLIER = (1 - (MAX_PLANET_MOUNTAINOUSNESS - planet.mountainousness)/MAX_PLANET_MOUNTAINOUSNESS)*(planet.radius/MAX_PLANET_RADIUS);
    const NOISE_FREQUENCY = STEPNESS_MULTIPLIER * RADIUS_MULTIPLIER + 0.5;
    const MAX_DECAL_COUNT = 20000 * (1 - (10 - planet.detailCount)/10);

    const [basePositions, setBasePositions] = React.useState<Array<THREE.Vector3>>([]);

    const darkenMaterial = React.useMemo(() => new THREE.MeshBasicMaterial({ color: "#bfbfbf" }), [planet.colors]);
    const icosahedronGeometry = React.useMemo(() => new THREE.IcosahedronGeometry(RADIUS, DETAIL ), [RADIUS]);
    const SEED = React.useMemo(() => Math.random()*1000, []);


    const decals = [
        {
            // PINE TREE
            density: 8,
            visible: (e : number) => {return( e > planet.waterLevel + 0.21 && e < planet.waterLevel + 1)}, 
            meshes: [
                {
                    ref: React.useRef<THREE.InstancedMesh>(null),
                    geometry: geometries.PINE_GEOMETRY,
                    material: darkenMaterial,
                    height_offset: 0.5,
                    color: {
                        hex: planet.colors?.grass ?? "#ffffff",
                        variation: 0.2
                    },
                    size_variation: 0.6,
                    randomize_rotation: false,
                },
                {
                    ref: React.useRef<THREE.InstancedMesh>(null),
                    geometry: geometries.PINE_TRUNK_GEOMETRY,
                    material: darkenMaterial,
                    height_offset: 0,
                    color: {
                        hex: planet.colors?.grass ?? "#ffffff",
                        variation: 0.2
                    },
                    size_variation: 0,
                    randomize_rotation: false,
                }
            ]
        },
        {
            // OAK TREE
            density: 2,
            visible: (e : number) => {return( e > planet.waterLevel + 0.21 && e < planet.waterLevel + 1)}, 
            meshes: [
                {
                    ref: React.useRef<THREE.InstancedMesh>(null),
                    geometry: geometries.OAK_GEOMETRY,
                    material: darkenMaterial,
                    height_offset: 0.5,
                    color: {
                        hex: planet.colors?.grass ?? "#ffffff",
                        variation: 0.2
                    },
                    size_variation: 1,
                    randomize_rotation: false,
                },
                {
                    ref: React.useRef<THREE.InstancedMesh>(null),
                    geometry: geometries.OAK_TRUNK_GEOMETRY,
                    material: darkenMaterial,
                    height_offset: 0,
                    color: {
                        hex: planet.colors?.grass ?? "#ffffff",
                        variation: 0.2
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
                    geometry: geometries.ROCK_GEOMETRY,
                    material: darkenMaterial,
                    height_offset: -0.05,
                    color: {
                        hex: planet.colors?.rock ?? "#ffffff",
                        variation: 0.2
                    },
                    size_variation: 1,
                    randomize_rotation: true,
                }
            ]
        },
    ]

    const color = new THREE.Color();
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const v3 = new THREE.Vector3();

    // GENERATE FIBONACCI
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
            // const variation = 0;
            v3.set(x + variation, y + variation, z + variation).normalize();
            points.push(v3.clone());
        }
        return points;
    }, [RADIUS_MULTIPLIER, MAX_DECAL_COUNT])

    // SET BASE POSITIONS
    React.useEffect(()=>{
        const arr = [];
        const positions = icosahedronGeometry.attributes.position;
        for (let i = 0; i < positions.count; i++){
            v3.fromBufferAttribute(positions, i).normalize();
            arr.push(v3.clone());
        }
        setBasePositions(arr);
    }, [icosahedronGeometry])

    // GENERATE VISUALS
    React.useEffect(()=>{
        generatePlanet();
        generateDecals();
    }, [basePositions, planet.waterLevel, planet.steepness, planet.mountainousness])

    React.useEffect(()=>{
        generateDecals();
    }, [planet.detailCount])

    const getNoiseValue = (vector : THREE.Vector3) => {
        let noise = 0;
        noise = 1 * noise4D(vector.x * NOISE_FREQUENCY, vector.y * NOISE_FREQUENCY, vector.z * NOISE_FREQUENCY, SEED);
        noise += 0.5 * noise4D(vector.x * NOISE_FREQUENCY * 2, vector.y * NOISE_FREQUENCY * 2, vector.z * NOISE_FREQUENCY * 2, SEED);
        noise += 0.25 * noise4D(vector.x * NOISE_FREQUENCY * 4, vector.y * NOISE_FREQUENCY * 4, vector.z * NOISE_FREQUENCY * 4, SEED);
        noise *= (MOUNTAINOUSNESS_MULTIPLIER ) * 8 + 0.02;
        return noise;
    }

    const generateDecals = () => {
        // DECALS
        let j = 0;
        let noise = 0;
        const upVector = new THREE.Vector3(0, 1, 0);
        const decal_count : Array<number> = []
        let total_density : number = 0;
        decals.forEach((d, k) => {
            decal_count[k] = 0;
            total_density += d.density;
        })

        fibonacciPoints.forEach((e, i) => {
            noise = getNoiseValue(e);
            v3.copy(e).multiplyScalar(planet.radius).addScaledVector(e, noise);
            let v3_length = v3.length();
            if(v3_length < planet.waterLevel + 0.1 ){
                v3.setLength(Math.max(v3_length - 0.2, planet.radius/2));
                v3_length = v3.length();
            }
            const point = v3.clone();

            // Generate random value from 1 to total density
            const density_threshold = Math.floor(Math.random() * total_density) + 1;
            let density_cumulative = 0;
            let loop = true;
            decals.forEach((d, k) => {
                d.meshes.forEach(m => {
                    m.ref.current?.setColorAt(i, color.set(colorVariation(m.color.hex, m.color.variation)));
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

        decals.forEach((d, k) => {
            d.meshes.forEach(m => {
                if(m.ref && m.ref.current) {
                    m.ref.current.count = decal_count[k];
                    m.ref.current.instanceMatrix.needsUpdate = true;
                }
            })
        })
    }
    const generatePlanet = () => {
        const positions = icosahedronGeometry.attributes.position;
        icosahedronGeometry.setAttribute( 'color', new THREE.BufferAttribute( new Float32Array( positions.count * 3 ), 3 ) );
        const colors = icosahedronGeometry.attributes.color;

        let noise = 0;
        // TERRAIN
        for ( let i = 0; i < positions.count; i ++ ) {
            if(!basePositions[i]) return;
            noise = getNoiseValue(basePositions[i]);

            v3.copy(basePositions[i]).multiplyScalar(planet.radius).addScaledVector(basePositions[i], noise);
            v3.clampLength(-planet.radius/2, MAX_HEIGHT)
            positions.setXYZ(i, v3.x, v3.y, v3.z);
        }

        const vertA = new THREE.Vector3();
        const vertB = new THREE.Vector3();
        const vertC = new THREE.Vector3();
        for ( let i = 0; i < positions.count / 3; i ++ ) {
            vertA.fromBufferAttribute(positions, i * 3);
            vertB.fromBufferAttribute(positions, i * 3 + 1);
            vertC.fromBufferAttribute(positions, i * 3 + 2);

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

            if(!planet.colors) return;
            if(shortest <= planet.waterLevel + 0.1 ) color.set(colorVariation(planet.colors.sand, 0.2));
            else if(shortest <= planet.waterLevel + 0.9 ) color.set(colorVariation(planet.colors.grass));
            else if(shortest <= planet.waterLevel + 1.75 ) color.set(colorVariation(planet.colors.rock, 0.05))
            else color.set(colorVariation(planet.colors.ice, 0.25))


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
                    vertexColors={ true }
                />
            </mesh>
            <mesh>
                <icosahedronGeometry args={[planet.waterLevel, 8]}/>
                <meshBasicMaterial
                    attach="material" color={planet.colors?.water}
                    transparent={true} opacity={0.85}
                />
            </mesh>
            {decals.map((d, i) => (
                d.meshes.map((m, j) => (
                    <instancedMesh
                    key={`decal-${i}-${j}`}
                    ref={m.ref}
                    args={[m.geometry, m.material, fibonacciPoints.length]}
                    ></instancedMesh>
                ))
            ))}
        </>
       
    )
}