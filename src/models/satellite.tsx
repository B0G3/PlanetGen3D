
import Renderable from "./renderable";
import SatelliteInterface from "../interfaces/satellite";
import Celestial from "./celestial";
export default class Satellite implements SatelliteInterface{
    parent: Celestial;
    entity: Celestial;
    distance: number;
    speed: number;
    tiltX: number;
    tiltY: number;
    constructor(parent: Celestial, entity: Celestial, distance: number, speed: number, tiltX: number = 0, tiltY: number = 0){
        this.parent = parent;
        this.entity = entity;
        this.distance = distance;
        this.speed = speed;
        this.tiltX = tiltX;
        this.tiltY = tiltY;
    }

    getGeometry(){
        return this.entity.geometry;
    }

    getSequence(){
        return this.entity.sequence;
    }

    getId(){
        return this.entity.id;
    }
}