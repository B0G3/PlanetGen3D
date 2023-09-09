import { PLANET_NAME_ADJECTIVES, PLANET_NAME_NOUNS } from "./constants";

import * as COLORD from 'colord'

export function getIcosahedronDetail(radius: number, multiplier: number = 1){
    return Math.ceil((radius * 5) / Math.sqrt(3) * multiplier);
}

export function colorVariation(color : COLORD.Colord, variation = 0.1){
    let random = Math.random() * variation - variation/2;

    const part = Math.round(random * (2/(variation))) / (2/(variation));
    return color.lighten(part);
}

export function generateName() {
    const adjective = PLANET_NAME_ADJECTIVES[Math.floor(Math.random() * PLANET_NAME_ADJECTIVES.length)];
    const noun = PLANET_NAME_NOUNS[Math.floor(Math.random() * PLANET_NAME_NOUNS.length)];
  
    const words = [adjective, noun];
  
    return words.join(' ');
}

export function calculateSphereSurfaceArea(radius : number) {
    const pi = Math.PI;
    const surfaceArea = 4 * pi * Math.pow(radius, 2);
    return surfaceArea;
}