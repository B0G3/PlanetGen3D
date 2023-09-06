import Renderable from "../models/renderable";

export default interface Satellite{
    parent: Renderable;
    entity: Renderable;
    distance: number;
    speed: number;
    tiltX: number;
    tiltY: number;

}