import hexColor from "../types/hexColor";

export default interface PlanetRing{
    enabled: boolean;
    color: hexColor;
    startDistance: number;
    width: number;
    speed: number;
    density: number;
    tiltX: number;
    tiltY: number;
}