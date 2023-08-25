import * as THREE from "three"
import React from "react";
import { CameraControls } from '@react-three/drei';
import { useFrame } from "@react-three/fiber";
import Background from "./background";
import Celestial from "../../models/celestial.js";
import Renderable from "../../models/renderable";
import Satellite from "../../models/satellite";
import CelestialGeometry from "./celestial"

interface Props{
    celestials: Array<Celestial>,
    selectedEntity: Renderable | Satellite | null,
}

export default function Universe({celestials, selectedEntity} : Props){
	const cameraControlRef = React.useRef<CameraControls | null>(null);

    const updateCamera = (transition = false) => {
        const matrixWolrd = selectedEntity?.getGeometry()?.matrixWorld;
        if(!matrixWolrd) return;
        const position = new THREE.Vector3();
        position.setFromMatrixPosition( matrixWolrd);

        if(cameraControlRef.current){
            cameraControlRef.current.moveTo(position.x, position.y, position.z, transition);
        }
    }

    useFrame((state, delta)=> {
        updateCamera(false);
    })

    return (<>
        <group rotation={[-Math.PI/2, 0, 0]}>
            {celestials.map((e, k) => 
                <CelestialGeometry key={e.id} celestial={e}></CelestialGeometry> 
            )}
        </group>
		<CameraControls maxDistance={80} ref={cameraControlRef}/>
        <Background></Background>
    </>);
}