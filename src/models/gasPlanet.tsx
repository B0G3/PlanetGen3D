import Planet from "../interfaces/planet";
import PlanetRing from "../interfaces/planetRing";
import hexColor from "../types/hexColor";
import Celestial from "./celestial";
import Satellite from "./satellite";

export default class GasPlanet extends Celestial implements Planet{
    color: hexColor = '#ffffff';
    clouds?: Array<Satellite>;
    ring?: PlanetRing;
}