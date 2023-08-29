import Renderable from "./renderable";
import Satellite from "./satellite";
import CelestialInterface from "../interfaces/celestial";
import * as THREE from 'three';

export default abstract class Celestial extends Renderable implements CelestialInterface{
    name: string;
    radius: number = 5;
    satellites: Array<Satellite> = [];

    constructor(position: THREE.Vector3, radius: number){
        super(position);
        this.radius = radius;
        this.name = `Entity #${this.id}`
    }

    setName(name: string){
        this.name = name;
    }

    setRadius(radius: number){
        this.radius = radius;
    }

    addSatellite(entity: Renderable, radius: number, speed: number, tiltX?: number, tiltY?: number){
        entity.setPosition(new THREE.Vector3(0,0,0));
        let satellite = new Satellite(this, entity, radius, speed, tiltX, tiltY)
        this.satellites.push(satellite);
        return satellite;
    }
}