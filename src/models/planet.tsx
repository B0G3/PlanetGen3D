import PlanetRing from "../interfaces/planetRing";
import hexColor from "../types/hexColor";
import Celestial from "./celestial";

export default abstract class Planet extends Celestial{
    cloudCount: number = 0;
    cloudColor: hexColor = '#efefef';
    ring!: PlanetRing;

    constructor(position: THREE.Vector3, radius: number){
        super(position, radius);

        const random = Math.random();
        const withRing = (random < 0.1)

        this.ring = {
            color: '#000',
            enabled: withRing,
            startDistance: this.radius + 1 ,
            width: this.radius * (Math.random()*0.5 + 0.4),
            speed: 0.1 + Math.random()*0.8,
            density: 0.05 + Math.random()*0.6,
            tiltX: Math.PI/4 - Math.random()*Math.PI/2,
            tiltY: Math.PI/4 - Math.random()*Math.PI/2,
        }
    }
}