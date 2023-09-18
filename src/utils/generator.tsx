
import * as THREE from 'three';
import TerrestialPlanet from '../models/terrestialPlanet';
import Star from '../models/star';
import GasPlanet from '../models/gasPlanet';
import { MAX_PLANET_RADIUS, MAX_STAR_RADIUS, MIN_STAR_RADIUS } from './constants';
import BlackHole from '../models/blackHole';

export function createRandomTerrestial(radius?: number){
    let planet = new TerrestialPlanet(new THREE.Vector3(0,0,0), radius);
    return planet;
}

export function createRandomStar(radius?: number){
    if(!radius) radius = Math.random() * (MAX_STAR_RADIUS-MIN_STAR_RADIUS) + MIN_STAR_RADIUS
    let star = new Star(new THREE.Vector3(0,0,0), radius);
    return star;
}

export function createRandomGas(radius?: number){
    if(!radius) radius = Math.random() * (MAX_STAR_RADIUS-MIN_STAR_RADIUS) + MIN_STAR_RADIUS
    let star = new Star(new THREE.Vector3(0,0,0), radius);
    return star;
}


function generateTerrestial(radius: number){
    let planet = new TerrestialPlanet(new THREE.Vector3(0,0,0), radius);
    let max_moons = Math.floor(Math.sqrt(radius/2));
    let chance = 1/2;
    let distance = 5 + Math.random() * 4;
    for(let i = 0; i < max_moons; i++){
        if(Math.random() < chance){
            let moonRadius = Math.min(Math.max(Math.ceil(planet.radius/3) * Math.random(), 1), MAX_PLANET_RADIUS)
            let moon = new TerrestialPlanet(new THREE.Vector3(0,0,0), moonRadius);
            planet.addSatellite(moon, distance, Math.random()*1.8 + 0.2, Math.PI * Math.random() - Math.PI/2, Math.PI * Math.random() - Math.PI/2);
            distance += moonRadius +  + Math.random() * 4 + 4;
        }
        // chance *= 1/2;
    }

    return {pivot: planet, radius: distance + planet.radius};
}

function generatePlanetarySystem(planetCount: number){
    let starRadius = Math.min(MAX_STAR_RADIUS, 25 + Math.random()*25)
    let star = createRandomStar(starRadius);
    let distance = Math.random() * 12 + 4;
    let tiltX = Math.PI/16 - Math.PI/8 * Math.random();
    let tiltY = Math.PI/16 - Math.PI/8 * Math.random();
    for(let i = 0; i < planetCount; i++){
        let planetRadius = Math.min(Math.max(Math.ceil(star.radius/2) * Math.random(), 4), MAX_PLANET_RADIUS)
        let {pivot, radius} = generateTerrestial(planetRadius);
        star.addSatellite(pivot, distance + radius, Math.random() * 1 + 0.2, tiltX, tiltY);

        distance += pivot.radius + radius + Math.random() * 4 + 2;
    }
    return {pivot: star, radius: distance + starRadius};
} 

export function generateUniverse(systemCount: number){
    let hole = new BlackHole(new THREE.Vector3(), 40);
    // hole.setColor("#000000");
    hole.setName('The origin');

    let tiltX = Math.PI/32 - Math.PI/16 * Math.random();
    let tiltY =Math.PI/32 - Math.PI/16 * Math.random();
    let distance = 0;
    for(let i = 0; i<systemCount; i++){
        let {pivot, radius} = generatePlanetarySystem(Math.random() * 6 + 3);
        if(i === 0 ) distance += radius/2 + 10 + hole.radius;
        else distance += radius;


        let offsetTiltX =Math.PI/32 - Math.PI/16 * Math.random()
        let offsetTilty = Math.PI/32 - Math.PI/16 * Math.random()
        hole.addSatellite(pivot, distance, 0.5, tiltX + offsetTiltX, tiltY + offsetTilty);
    }
    return hole;
}