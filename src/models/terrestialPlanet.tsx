import * as THREE from 'three';
import { generateName } from '../utils/helpers';
import { MAX_PLANET_MOUNTAINOUSNESS, MAX_PLANET_RADIUS, MAX_PLANET_STEEPNESS, MIN_PLANET_MOUNTAINOUSNESS, MIN_PLANET_RADIUS, PLANET_COLORS } from '../utils/constants';
import PlanetColors from './planetColors';
import Planet from './planet';

import mixPlugin from "colord/plugins/mix";
import { colord, extend } from 'colord';
import hexColor from '../types/hexColor';
extend([mixPlugin]);

export default class TerrestialPlanet extends Planet{
    waterLevel: number = 5;
    steepness: number = 5;
    mountainousness: number = 5;
    detailCount: number = 0;
    cloudCount: number = 0;
    enableWater: boolean = false;
    enableVegetation: boolean = false;
    colors!: PlanetColors;

    constructor(position: THREE.Vector3 = new THREE.Vector3(0,0,0), radius: number = 5){
      super(position, radius);
      this.randomize();
    }

    setWaterLevel(level: number){
      this.waterLevel = Math.max(level, MIN_PLANET_RADIUS - 0.5);
    }

    setSteepness(steepness: number){
      this.steepness = steepness;
    }

    setMountainousness(mountainousness: number){
      this.mountainousness = mountainousness;
    }

    setColors(colors: PlanetColors){
      this.colors = colors;
    }
    
    randomize(){
      const waterLevel = this.radius - (Math.random() - 0.5);
      const stepness = (waterLevel >= this.radius) ? (Math.random() * (MAX_PLANET_STEEPNESS - 4) + 4) : (Math.random() * (MAX_PLANET_STEEPNESS - 3) + 2);
      
      let mountainousness = 0;
      const waterChance = 0.3;
      if(Math.random()<=waterChance){ // exo planet
        this.enableWater = true;
        this.cloudCount = 2 + Math.floor(this.radius/2) + Math.random() * (this.radius/2);
        mountainousness = Math.random() * Math.max(MIN_PLANET_MOUNTAINOUSNESS, (MAX_PLANET_MOUNTAINOUSNESS - 2)) + 2;

        const vegetationChange = 0.75;
        if(Math.random() <= vegetationChange){
          this.enableVegetation = true;
        }

      }else{
        mountainousness = Math.random() * Math.max(MIN_PLANET_MOUNTAINOUSNESS, (MAX_PLANET_MOUNTAINOUSNESS - 6)) + 3;
      }


      this.name = generateName();
      this.waterLevel = waterLevel;
      this.steepness = stepness;
      this.mountainousness = mountainousness;
      this.detailCount = 2 + Math.random()*8;

      const planetColors = new PlanetColors();
      planetColors.randomize();
      this.setColors(planetColors);
      this.cloudColor = colord(this.colors.computed.ice[1]).mix(this.colors.computed.water[1]).lighten(0.1).toHex() as hexColor;
    }
}