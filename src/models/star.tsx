import * as THREE from 'three';
import Celestial from "./celestial";
import hexColor from '../types/hexColor';
import { generateName } from '../utils/helpers';
import { random } from 'colord';

export default class Star extends Celestial{
    fluctuations: number = 1;
    color: hexColor = '#ffffff';
    constructor(position: THREE.Vector3, radius: number){
        super(position, radius);
        this.randomize();
    }

    setFluctuations(fluctuations : number){
        this.fluctuations = fluctuations;
    }

    setColor(color : hexColor){
        this.color = color;
    }

    randomize(){
        this.name = generateName();
        this.fluctuations = Math.random()*2;
        this.color = random().toHex() as hexColor;
      }

}