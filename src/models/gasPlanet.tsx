import hexColor from "../types/hexColor";
import Planet from "./planet";

export default class GasPlanet extends Planet{
    color: hexColor = '#ffffff';
    coreColor: hexColor = '#afafaf'
    cloudCount: number = 0;
    coreRadius: number = 5;
}