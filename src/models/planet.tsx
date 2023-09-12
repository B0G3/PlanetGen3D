import PlanetRing from "../interfaces/planetRing";
import hexColor from "../types/hexColor";
import Celestial from "./celestial";

export default abstract class Planet extends Celestial{
    cloudCount: number = 0;
    cloudColor: hexColor = '#efefef';
    ring?: PlanetRing;
}