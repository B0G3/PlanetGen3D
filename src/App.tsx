import React from 'react';
import logo from './logo.svg';
// import './App.css';
import './App.scss';
import { createRandomPlanet, solarSystem } from './utils/generator';
import Star from './models/star';
import Celestial from './models/celestial';
import { Canvas } from '@react-three/fiber';
import Universe from './components/geometry/universe';
import { Vector3 } from 'three';
import CelestialControls from './components/ui/celestialControls';

const CELESTIALS: Array<Celestial> = [];
CELESTIALS.push(solarSystem());

const App = () => {
  const [celestials, setCelestials] = React.useState(CELESTIALS);
  const [entity, setEntity] = React.useState(null);

  return (
    <div className="canvas-background" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'relative'}}>
      <Canvas>
          {/* <Stats></Stats> */}
          <Universe
            selectedEntity={entity}
            // setSelectedEntity={setEntity}
            celestials={celestials}
            // setCelestials={setCelestials}
          ></Universe>
      </Canvas>
      <CelestialControls
        selectedEntity={entity}
        celestials={celestials}
        setSelectedEntity={setEntity}
        setCelestials={setCelestials}
      ></CelestialControls>
  </div>
  );
}

export default App;
