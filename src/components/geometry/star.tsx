import React from "react";
import Star from "../../models/star";
import * as THREE from "three";

export default function({star} : {star: Star}){

    return (
        <mesh>
            <sphereGeometry args={[star.radius, 16, 16]}></sphereGeometry>
            <meshBasicMaterial
                    side={THREE.DoubleSide}
                    attach="material" color={star.color}
            />
        </mesh>
    )
}