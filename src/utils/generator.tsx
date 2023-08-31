
import * as THREE from 'three';
import TerrestialPlanet from '../models/terrestialPlanet';
import Star from '../models/star';
import GasPlanet from '../models/gasPlanet';

export function createRandomPlanet(radius?: number){
    let planet = new TerrestialPlanet(new THREE.Vector3(0,0,0), radius);
    // let max_moons = 3;
    // let k = 1/2;
    // let radius = planet.radius;
    // for(let i = 1; i <= max_moons; i++){
    //     let random = Math.random();
    //     // console.log(random);
    //     if(random < k) break;
    //     k *= k;

    //     let moon = new Planet();
    //     let moon_radius = planet.radius - Math.ceil(Math.random() * 4) - 2;
    //     moon.setRadius(moon_radius);

    //     radius += 6 + moon_radius + Math.random() * 6;

    //     moon.setPosition(new THREE.Vector3(0, radius, 0));
    //     moon.setWaterLevel(moon_radius - 0.5);
    //     planet.addSatellite(moon, radius, Math.random() * 0.15 + 0.05, Math.random() * 0.15 + 0.05);
    // }
    // console.log(planet);
    return planet;
}

export function solarSystem(){
    let sun = new Star(new THREE.Vector3(0,0,0), 16);
    sun.setName('Sun')
    sun.setColor("#ef7e00");
    let radius = sun.radius;
    let satellite = null;

    let mercury = new TerrestialPlanet(new THREE.Vector3(0,0,0), 2);
    mercury.setName('Mercury');
    mercury.setColors({ice: '#8b7ba8', rock: '#635975', grass: '#5c4c7a', sand: '#977baf', water: '#6840d6'})
    mercury.setSteepness(3);
    mercury.setMountainousness(5);
    mercury.setWaterLevel(1.5);
    satellite = sun.addSatellite(mercury, radius + 14, 0.2);
    radius = satellite.distance;


    let venus = new TerrestialPlanet(new THREE.Vector3(0,0,0), 5);
    venus.setName('Venus');
    venus.setColors({ice: '#c96b18', rock: '#5f5043', grass: '#8c5e35', sand: '#a07f62', water: '#4597ad'})
    venus.setSteepness(6);
    venus.setMountainousness(7);
    venus.setWaterLevel(4);
    satellite = sun.addSatellite(venus, radius + 14, 0.4)
    radius = satellite.distance;


    let earth = new TerrestialPlanet(new THREE.Vector3(0,0,0), 5);
    earth.setName('Earth');
    earth.setColors({ice: '#f0f3f4', rock: '#b2b2b2', grass: '#459e4f', sand: '#e8cd5d', water: '#27a1f9'})
    earth.setSteepness(6);
    earth.setMountainousness(5);
    earth.setWaterLevel(5);
    satellite = sun.addSatellite(earth, radius + 24, 0.2)
    radius = satellite.distance;

    let mooon = new TerrestialPlanet(new THREE.Vector3(0,0,0), 1);
    mooon.setName('Moon');
    mooon.setColors({ice: '#757575', rock: '#757575', grass: '#757575', sand: '#757575', water: '#757575'})
    mooon.setSteepness(3);
    mooon.setMountainousness(4);
    mooon.setWaterLevel(0);
    earth.addSatellite(mooon, earth.radius + 6, 0.5, Math.PI/8, Math.PI/8)

    let mars = new TerrestialPlanet(new THREE.Vector3(0,0,0), 3);
    mars.setName('Mars');
    mars.setColors({ice: '#752f2f', rock: '#553535', grass: '#752f2f', sand: '#9c5543', water: '#538ead'})
    mars.setSteepness(5);
    mars.setMountainousness(3);
    mars.setWaterLevel(2.4);
    satellite = sun.addSatellite(mars, radius + 24, 0.2)
    radius = satellite.distance;

    let jupiter = new GasPlanet(new THREE.Vector3(0,0,0), 10);
    jupiter.setName('Jupiter');
    satellite = sun.addSatellite(jupiter, radius + 24, 0.2)
    radius = satellite.distance;

    let ganymede = new TerrestialPlanet(new THREE.Vector3(0,0,0), 2);
    ganymede.setName('Ganymede');
    ganymede.setColors({ice: '#757575', rock: '#757575', grass: '#757575', sand: '#757575', water: '#757575'})
    ganymede.setSteepness(3);
    ganymede.setMountainousness(10);
    ganymede.setWaterLevel(0);
    jupiter.addSatellite(ganymede, jupiter.radius + 5, 0.6, Math.PI/4,0)

    let callisto = new TerrestialPlanet(new THREE.Vector3(0,0,0), 2);
    callisto.setName('Callisto');
    callisto.setColors({ice: '#757575', rock: '#757575', grass: '#757575', sand: '#757575', water: '#757575'})
    callisto.setSteepness(3);
    callisto.setMountainousness(10);
    callisto.setWaterLevel(0);
    jupiter.addSatellite(callisto, jupiter.radius + 9, 0.4, 0, Math.PI/4)

    let io = new TerrestialPlanet(new THREE.Vector3(0,0,0), 2);
    io.setName('Io');
    io.setColors({ice: '#757575', rock: '#757575', grass: '#757575', sand: '#757575', water: '#757575'})
    io.setSteepness(3);
    io.setMountainousness(10);
    io.setWaterLevel(0);
    jupiter.addSatellite(io, jupiter.radius + 11, 0.2, -Math.PI/4, 0)

    let europa = new TerrestialPlanet(new THREE.Vector3(0,0,0), 2);
    europa.setName('Europa');
    europa.setColors({ice: '#757575', rock: '#757575', grass: '#757575', sand: '#757575', water: '#757575'})
    europa.setSteepness(3);
    europa.setMountainousness(10);
    europa.setWaterLevel(0);
    jupiter.addSatellite(europa, jupiter.radius + 13, 0.5,  0, -Math.PI/4)

    let saturn = new GasPlanet(new THREE.Vector3(0,0,0), 8);
    saturn.setName('Saturn');
    saturn.ring = {
        startDistance:  10,
        endDistance: 19
    }
    satellite = sun.addSatellite(saturn, radius + 36, 0.2)
    radius = satellite.distance;



    

    return sun;
}

export function earth(){
    let earth = new TerrestialPlanet(new THREE.Vector3(0,0,0), 5);
    earth.setName('Earth');
    earth.setColors({ice: '#f0f3f4', rock: '#b2b2b2', grass: '#459e4f', sand: '#e8cd5d', water: '#27a1f9'})
    earth.setSteepness(6);
    earth.setMountainousness(5);
    earth.setWaterLevel(5);
    return earth;
}