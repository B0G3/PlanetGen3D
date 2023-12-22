import * as THREE from "three"
import React from "react";
import { CameraControls } from '@react-three/drei';
import { useFrame, useThree } from "@react-three/fiber";
import Background from "./background";
import Celestial from "../../models/celestial";
import Renderable from "../../models/renderable";
import Satellite from "../../models/satellite";
import CelestialGeometry from "./celestial/celestial"
import { MAX_PLANET_RADIUS } from "../../utils/constants";

interface Props{
    celestials: Array<Celestial>,
    selectedEntity: Celestial | Satellite | null,
    setSelectedEntity: Function
}

export default function Universe({celestials, selectedEntity, setSelectedEntity} : Props){
    const { camera, scene } = useThree();
	const cameraControlRef = React.useRef<CameraControls | null>(null);
    const [minDistance, setMinDistance] = React.useState(0);
    const v3 = new THREE.Vector3();

    React.useEffect(() => {
        scene.traverse(obj => obj.frustumCulled = false);
        camera.far = 10000000;
        camera.updateProjectionMatrix();
    }, [])

    React.useEffect(()=>{
        if(!selectedEntity) return;
        if(selectedEntity instanceof Celestial){
            setMinDistance(selectedEntity.radius * 1.5);
            cameraControlRef.current?.dollyTo(selectedEntity.radius * 3, true);
        }
        if(selectedEntity instanceof Satellite){
            let entity = selectedEntity.entity;
            if(entity instanceof Celestial){
                setMinDistance(entity.radius * 1.5);
                cameraControlRef.current?.dollyTo(entity.radius * 3, true);
            }
        }
    }, [selectedEntity])

    const updateCamera = (transition = false) => {
        const matrixWolrd = selectedEntity?.getGeometry()?.matrixWorld;
        if(!matrixWolrd) return;
        v3.setFromMatrixPosition(matrixWolrd);

        if(cameraControlRef.current){
            cameraControlRef.current.moveTo(v3.x, v3.y, v3.z, transition);
        }
    }

    
    useFrame((state, delta)=> {
        updateCamera(true);
    })

    return (<>
        <group rotation={[-Math.PI/2, 0, 0]}>
            {celestials.map((e, k) => 
                <CelestialGeometry key={e.id} celestial={e} setSelectedEntity={setSelectedEntity}></CelestialGeometry> 
            )}
        </group>
		<CameraControls smoothTime={0.15} minDistance={minDistance} maxDistance={1000} ref={cameraControlRef}/>
        <Background></Background>
    </>);
}