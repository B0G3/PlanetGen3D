import * as THREE from 'three';
import Celestial from "./celestial";
import hexColor from '../types/hexColor';

export default class Star extends Celestial{
    fluctuations: number = 1;
    color: hexColor = '#ffffff';
    constructor(position: THREE.Vector3, radius: number){
        super(position, radius);
    }

    setFluctuations(fluctuations : number){
        this.fluctuations = fluctuations;
    }

    setColor(color : hexColor){
        this.color = color;
    }
}