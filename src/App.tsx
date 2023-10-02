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
import { GlobalSettingsContext } from './components/ui/globalSettingsContext';
import hexColor from './types/hexColor';
import { colord } from 'colord';

const CELESTIALS: Array<Celestial> = [];
CELESTIALS.push(generateUniverse(3));
// CELESTIALS.push(createRandomTerrestial(5));
const App = () => {
  const [backgroundColor, setBackgroundColor] = React.useState<hexColor>("#1c0c66");
  const [trajectories, setTrajectories] = React.useState<boolean>(false);

  const [celestials, setCelestials] = React.useState(CELESTIALS);
  const [selectedEntity, setSelectedEntity] = React.useState<Celestial | Satellite | null>(null);

  return (
    <GlobalSettingsContext.Provider value={{ backgroundColor, setBackgroundColor, trajectories, setTrajectories }}>
      <div className="canvas-background" style={{justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', position: 'relative', background: `linear-gradient(180deg, ${backgroundColor} 0%, ${colord(backgroundColor).darken(0.1).toHex()} 100%)`}}>
        <Canvas>
            {/* <Stats></Stats> */}
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
    </GlobalSettingsContext.Provider>
  );
}

export default App;
