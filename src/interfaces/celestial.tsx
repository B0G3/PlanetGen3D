import Satellite from "../models/satellite";

export default interface Celestial{
    name: string;
    radius: number;
    satellites: Array<Satellite> ;

}