import React from 'react';
import logo from './logo.svg';
// import './App.css';
import './App.scss';
import {solarSystem} from './utils/generator';
import Star from './models/star';
import Celestial from './models/celestial';
import { Canvas } from '@react-three/fiber';
import Universe from './components/geometry/universe';
import { Vector3 } from 'three';
import {Stats} from '@react-three/drei'
import Controls from './components/ui/controls';

const CELESTIALS: Array<Celestial> = [];
// const earth2 = earth();
// earth2.setPosition(new Vector3(10,10,10));
// CELESTIALS.push(earth());
// CELESTIALS.push(earth2);

CELESTIALS.push(solarSystem());

const App = () => {
  const [celestials, setCelestials] = React.useState(CELESTIALS);
  const [entity, setEntity] = React.useState(null);

  return (
    <div className="canvas-background" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'relative'}}>
      <Canvas>
          <Stats></Stats>
          <Universe
            selectedEntity={entity}
            // setSelectedEntity={setEntity}
            celestials={celestials}
            // setCelestials={setCelestials}
          ></Universe>
      </Canvas>
      <Controls
        selectedEntity={entity}
        celestials={celestials}
        setSelectedEntity={setEntity}
        setCelestials={setCelestials}
      ></Controls>
  </div>
  );
}

export default App;
