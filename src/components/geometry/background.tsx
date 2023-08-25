import React from "react";
import * as THREE from 'three';

const starMaterial = new THREE.MeshBasicMaterial({ color: "white", transparent: true, opacity: 0.25 });
const starGeometry = new THREE.BoxGeometry(4, 4, 4);

export default function Background(){
    const meshRef = React.useRef<THREE.InstancedMesh>(null);
    const matrix = new THREE.Matrix4();
    const points : Array<THREE.Vector3> = React.useMemo(()=>{
        const numPoints = 2000;
        const points = [];
        const yOffset = 2 / numPoints;
        const phi = Math.PI * (3.0 - Math.sqrt(5.0));
        for (let i = 0; i < numPoints; i++) {
            const y = i * yOffset - 1 + yOffset / 2;
            const r = Math.sqrt(1 - y * y);
            const theta = phi * i;
                
            const x = Math.cos(theta) * r + (Math.random() - 0.5) * 1;
            const z = Math.sin(theta) * r + (Math.random() - 0.5) * 1;
                
            points.push(new THREE.Vector3(x, y, z).normalize().multiplyScalar(800));
        }
        return points;
    }, []);
  
    React.useEffect(()=>{
        points.forEach((e, k) => {
            matrix.makeTranslation(e);
            if(meshRef && meshRef.current) meshRef.current.setMatrixAt(k, matrix);
        })
    }, [meshRef])
   

    return (
        <instancedMesh ref={meshRef} args={[starGeometry, starMaterial, points.length]}></instancedMesh>
    )
}