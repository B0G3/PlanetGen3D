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
    const [maxDistance, setMaxDistance] = React.useState(0);

    React.useEffect(()=>{
        if(selectedEntity instanceof Celestial){
            setMinDistance(selectedEntity.radius + 4);
            setMaxDistance(selectedEntity.radius * 3 + 4);
        }
    }, [selectedEntity])

    const updateCamera = (transition = false) => {
        const matrixWolrd = selectedEntity?.getGeometry()?.matrixWorld;
        if(!matrixWolrd) return;
        const position = new THREE.Vector3();
        position.setFromMatrixPosition(matrixWolrd);

        if(cameraControlRef.current){
            cameraControlRef.current.moveTo(position.x, position.y, position.z, transition);
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
        {/* <ambientLight></ambientLight> */}{
		<CameraControls smoothTime={0.2} minDistance={minDistance} maxDistance={maxDistance} ref={cameraControlRef}/>}
        <Background></Background>
    </>);
}