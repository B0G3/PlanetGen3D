import PlanetRing from "../interfaces/planetRing";
import hexColor from "../types/hexColor";
import Planet from "./planet";
import Satellite from "./satellite";

export default class GasPlanet extends Planet{
    color: hexColor = '#ffffff';
    clouds?: Array<Satellite>;
    ring?: PlanetRing;
    cloudCount: number = 0;
}