import * as THREE from 'three';
import Celestial from "./celestial";
import hexColor from '../types/hexColor';

export default class Star extends Celestial{
    glowiness: number = 0.5;
    color: hexColor = '#ffffff';
    constructor(position: THREE.Vector3, radius: number){
        super(position, radius);
    }

    setGlowiness(glowiness : number){
        this.glowiness = glowiness;
    }

    setColor(color : hexColor){
        this.color = color;
    }
}