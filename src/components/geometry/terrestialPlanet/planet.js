import React from 'react';
import { geoVoronoi } from 'd3-geo-voronoi';
import * as THREE from 'three';
import {Noise} from 'noisejs';
import earcut from 'earcut'
import PlanetTile from './tile';
import { calculateSphereSurfaceArea } from '../../../utils/helpers';

function Planet({planet}){
    const RADIUS = Math.max(planet.radius, planet.waterLevel);
    const NOISE = React.useMemo(() => new Noise(Math.random()), []);
    const NUM_POINTS = React.useMemo(() => { return Math.ceil(calculateSphereSurfaceArea(RADIUS)) * 3}, [RADIUS]);

    // Generate 2D points to be used in voronoi diagram
    const points_2d = React.useMemo(
        () => {
            const points = [];
            const yOffset = 2 / NUM_POINTS;
            const phi = Math.PI * (3.0 - Math.sqrt(5.0));
            for (let i = 0; i < NUM_POINTS; i++) {
                const y = i * yOffset - 1 + yOffset / 2;
                const r = Math.sqrt(1 - y * y);
                const theta = phi * i;
                    
                const x = Math.cos(theta) * r;
                const z = Math.sin(theta) * r;
                    
                const projectedX = (2*x)/(1-z);
                const projectedY = (2*y)/(1-z);
                points.push([projectedX, projectedY]);
            }
            return points;
        }, [planet.radius, planet.waterLevel]);

    // Generate Voronoi diagram
    const voronoi = React.useMemo(()=>geoVoronoi().polygons(points_2d), [points_2d]);
    // Generate 3D tile data
    const tiles = React.useMemo(() => {
            // Mutate data
            const sphereRadius = planet.radius + 1;
            const planet_center = new THREE.Vector3();
            return voronoi.features.map((e, k) => {
                let vertices_2d = e.geometry.coordinates[0];
        
                // Reverse projection 2d -> 3d
                let vertices = vertices_2d.map(point => {
                    const [x, y] = point;

                   
                    const newX = (4*x)/(x*x+y*y+4);
                    const newY = (4*y)/(x*x+y*y+4);
                    const newZ = 1 - 2*(4/(x*x+y*y+4));

                    let perlin =  NOISE.perlin3(newX*2, newY*2, newZ*2);
                    let position = new THREE.Vector3(newX * sphereRadius, newY * sphereRadius, newZ * sphereRadius);
                    return {position: position, perlin: perlin};
        
                })

                return {
                    neighbours: e.properties.neighbours,
                    indices: new Uint16Array(earcut(e.geometry.coordinates[0].flat())),
                    points: vertices,
                }
            })
        },
        [points_2d],
    );

    // useFrame((state, delta) => {
    //     let rotation = tileGroup.current.rotation;
    //     tileGroup.current.rotation.set(rotation.x + 0.001, rotation.y, rotation.z);
    // })


    return (
        <>
        {tiles.map((e, k) => {
                return (
                    <PlanetTile key={[planet.id, k]} points={e.points} indices={e.indices} planet={planet}></PlanetTile> 
                )
        })}
            {/* <mesh>
                <sphereGeometry args={[planet.radius, 16, 16]}></sphereGeometry>
            </mesh> */}
        </>
    )
}

export default Planet;
  