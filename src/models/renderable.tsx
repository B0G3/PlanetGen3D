import Entity from "./entity";
import * as THREE from 'three';

export default abstract class Renderable extends Entity{
    position: THREE.Vector3;
    geometry?: THREE.Object3D;

    constructor(position: THREE.Vector3){
        super();
        this.position = position;
    }

    setPosition(position: THREE.Vector3){
        this.position = position;
    }

    setGeometry(geometry: THREE.Object3D){
        this.geometry = geometry;
    }

    getGeometry(){
        return this.geometry;
    }
}