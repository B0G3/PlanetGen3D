import BlackHoleModel from "../../../models/blackHole";

export default function BlackHole({blackHole}: {blackHole: BlackHoleModel}){
    return (
        <mesh>
            <icosahedronGeometry args={[blackHole.radius, 8]}/>
            <meshBasicMaterial
                attach="material" 
                color="black"
            />
        </mesh>
    )
}