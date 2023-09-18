import Renderable from "./renderable";
import Satellite from "./satellite";
import * as THREE from 'three';

export default abstract class Celestial extends Renderable{
    name: string;
    radius: number = 5;
    satellites: Array<Satellite> = [];
    sequence: Array<number> = [this.id];

    constructor(position: THREE.Vector3, radius: number){
        super(position);
        this.radius = radius;
        this.name = `Entity #${this.id}`
    }

    getSequence(){
        return this.sequence;
    }

    setName(name: string){
        this.name = name;
    }

    setRadius(radius: number){
        this.radius = radius;
    }

    addSatellite(entity: Celestial, radius: number, speed: number, tiltX?: number, tiltY?: number){
        const _deepUpdateSequence = (entity: Celestial, sequence: Array<number>) =>{
            entity.satellites.forEach(e =>{
                e.entity.sequence = [...sequence, ...e.entity.sequence]
                _deepUpdateSequence(e.entity, sequence);
            });
        }

        entity.setPosition(new THREE.Vector3(0,0,0));
        entity.sequence = [...this.sequence, ...entity.sequence];
        _deepUpdateSequence(entity, this.sequence);
        let satellite = new Satellite(this, entity, radius, speed, tiltX, tiltY)
        this.satellites.push(satellite);
        return satellite;
    }
}