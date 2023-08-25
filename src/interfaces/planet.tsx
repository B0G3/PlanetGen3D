import Satellite from "../models/satellite"
import PlanetRing from "./planetRing";

export default interface Planet{
    clouds?: Array<Satellite>;
    ring?: PlanetRing
}