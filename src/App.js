import React from 'react';
import './App.css';
import SpinningCube from './spinningcube';
import Cube from './cube';
import Importobj from './importObj';

function App() {
  return (
   <div className="App">
      3D with three js
      {/* <SpinningCube width={800} height={600} /> */}
      {/* <Cube width={800} height={600} /> */}
      <Importobj width={window.innerWidth} height={window.innerHeight} />
   </div>
  );
}

export default App;
