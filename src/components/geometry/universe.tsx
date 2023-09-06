import * as THREE from "three"
import React from "react";
import { CameraControls } from '@react-three/drei';
import { useFrame } from "@react-three/fiber";
import Background from "./background";
import Celestial from "../../models/celestial";
import Renderable from "../../models/renderable";
import Satellite from "../../models/satellite";
import CelestialGeometry from "./celestial"
import { MAX_PLANET_RADIUS } from "../../utils/constants";

interface Props{
    celestials: Array<Celestial>,
    selectedEntity: Renderable | Satellite | null,
}

export default function Universe({celestials, selectedEntity} : Props){
	const cameraControlRef = React.useRef<CameraControls | null>(null);
    const [minDistance, setMinDistance] = React.useState(0);
    const v3 = new THREE.Vector3();
    const [cameraPosition, setCameraPosition] = React.useState<THREE.Vector3>(v3);

    // React.useEffect(()=>{
    //     if(!selectedEntity) return;
    //     if(selectedEntity instanceof Celestial){
    //         setMinDistance(selectedEntity.radius * 1.5);
    //         cameraControlRef.current?.dollyTo(selectedEntity.radius * 3, false);
    //         // cameraControlRef.current?.dollyTo(selectedEntity.radius * 3, true);
    //         // setMaxDistance(selectedEntity.radius * 4 + 4);
    //     }
    //     if(selectedEntity instanceof Satellite){
    //         let entity = selectedEntity.entity;
    //         if(entity instanceof Celestial){
    //             setMinDistance(entity.radius * 1.5);
    //             cameraControlRef.current?.dollyTo(entity.radius * 3, false);
    //             // cameraControlRef.current?.dollyTo(entity.radius * 3, true);
                
    //             // setMaxDistance(entity.radius * 4 + 4);
    //         }
    //     }
    // }, [selectedEntity])

    const updateCamera = (transition = false) => {
        const matrixWolrd = selectedEntity?.getGeometry()?.matrixWorld;
        if(!matrixWolrd) return;
        v3.setFromMatrixPosition(matrixWolrd);

        if(cameraControlRef.current){
            cameraControlRef.current.moveTo(v3.x, v3.y, v3.z, transition);
            cameraControlRef.current.getTarget(v3);
            setCameraPosition(v3);
        }
    }

    
    useFrame((state, delta)=> {
        updateCamera(true);
    })

    return (<>
        <group rotation={[-Math.PI/2, 0, 0]}>
            {celestials.map((e, k) => 
                <CelestialGeometry key={e.id} celestial={e}></CelestialGeometry> 
            )}
        </group>
		<CameraControls smoothTime={0.1} minDistance={minDistance} maxDistance={120} ref={cameraControlRef}/>
        <Background position={cameraPosition}></Background>
    </>);
}