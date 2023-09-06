import PlanetRing from "../interfaces/planetRing";
import Celestial from "./celestial";

export default abstract class Planet extends Celestial{
    cloudCount: number = 0;
    ring?: PlanetRing;
}