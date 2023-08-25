
import Renderable from "./renderable";
export default class Satellite{
    parent: Renderable;
    entity: Renderable;
    distance: number;
    speed: number;
    tiltX: number;
    tiltY: number;
    constructor(parent: Renderable, entity: Renderable, distance: number, speed: number, tiltX: number = 0, tiltY: number = 0){
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
}