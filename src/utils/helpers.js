import { PLANET_NAME_ADJECTIVES, PLANET_NAME_NOUNS } from "../utils/constants";

export function generateName() {
    const adjective = PLANET_NAME_ADJECTIVES[Math.floor(Math.random() * PLANET_NAME_ADJECTIVES.length)];
    const noun = PLANET_NAME_NOUNS[Math.floor(Math.random() * PLANET_NAME_NOUNS.length)];
  
    const words = [adjective, noun];
  
    return words.join(' ');
}

export function calculateSphereSurfaceArea(radius) {
    const pi = Math.PI;
    const surfaceArea = 4 * pi * Math.pow(radius, 2);
    return surfaceArea;
}

export function fibonacciSphere(numPoints){
    const points = [];
    const yOffset = 2 / numPoints;
    const phi = Math.PI * (3.0 - Math.sqrt(5.0));
    for (let i = 0; i < numPoints; i++) {
        const y = i * yOffset - 1 + yOffset / 2;
        const r = Math.sqrt(1 - y * y);
        const theta = phi * i;
            
        const x = Math.cos(theta) * r;
        const z = Math.sin(theta) * r;
            
        const projectedX = (2*x)/(1-z);
        const projectedY = (2*y)/(1-z);
        points.push([projectedX, projectedY]);
    }
    return points;
}