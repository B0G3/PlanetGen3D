import React from 'react';
import logo from './logo.svg';
// import './App.css';
import './App.scss';
import {createRandomTerrestial, generateUniverse} from './utils/generator';
import Star from './models/star';
import Celestial from './models/celestial';
import { Canvas } from '@react-three/fiber';
import Universe from './components/geometry/universe';
import { Vector3 } from 'three';
import {Stats} from '@react-three/drei'
import Controls from './components/ui/controls';
import Satellite from './models/satellite';

const CELESTIALS: Array<Celestial> = [];
CELESTIALS.push(generateUniverse(3));
// CELESTIALS.push(createRandomTerrestial(5));
const App = () => {
  const [celestials, setCelestials] = React.useState(CELESTIALS);
  const [selectedEntity, setSelectedEntity] = React.useState<Celestial | Satellite | null>(null);

  return (
    <div className="canvas-background" style={{justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', position: 'relative'}}>
      <Canvas>
          <Stats></Stats>
          <Universe
            selectedEntity={selectedEntity}
            setSelectedEntity={setSelectedEntity}
            celestials={celestials}
          ></Universe>
      </Canvas>
      <Controls
        selectedEntity={selectedEntity}
        celestials={celestials}
        setSelectedEntity={setSelectedEntity}
        setCelestials={setCelestials}
      ></Controls>
  </div>
  );
}

export default App;
