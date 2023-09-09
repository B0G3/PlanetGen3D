import * as THREE from 'three';
import { generateName } from '../utils/helpers';
import { MAX_PLANET_MOUNTAINOUSNESS, MAX_PLANET_RADIUS, MAX_PLANET_STEEPNESS, MIN_PLANET_RADIUS, PLANET_COLORS } from '../utils/constants';
import PlanetColors from '../interfaces/planetColors';
import Planet from './planet';

export default class TerrestialPlanet extends Planet{
    waterLevel: number = 5;
    steepness: number = 5;
    mountainousness: number = 5;
    detailCount: number = 0;
    cloudCount: number = 0;
    colors!: PlanetColors;

    constructor(position: THREE.Vector3 = new THREE.Vector3(0,0,0), radius: number = 5){
      super(position, radius);
      this.waterLevel = radius - 0.5;

      this.randomize(radius);
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

    randomizeColors(){
      const colors  = Object.keys(PLANET_COLORS).reduce((prev, val , i) => {
        return {
            ...prev, 
            [val]: PLANET_COLORS[val][(Math.floor(Math.random() * PLANET_COLORS[val].length))]
        }
      }, {} as PlanetColors)

      this.colors =  colors;
    }

    randomize(RADIUS: number | undefined){
      const radius = RADIUS ?? Math.max(Math.ceil(Math.random() * MAX_PLANET_RADIUS - 1), MIN_PLANET_RADIUS + 1);
      const waterLevel = radius - (Math.random() - 0.5);
      const stepness = (waterLevel >= radius) ? (Math.random() * (MAX_PLANET_STEEPNESS - 4) + 4) : (Math.random() * (MAX_PLANET_STEEPNESS - 3) + 2);
      const mountainousness = Math.random() * (MAX_PLANET_MOUNTAINOUSNESS - 2);

      this.name = generateName();
      this.radius = radius;
      this.waterLevel = waterLevel;
      this.steepness = stepness;
      this.mountainousness = mountainousness;
      this.randomizeColors();
    }
}