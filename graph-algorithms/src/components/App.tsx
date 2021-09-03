import React from 'react';
import './App.css';
import Node from './Node';

const App = () => {
  return (
    <div id="app">
      <h1>Graph Algorithm Visualiser</h1>
      <Node xPosition={100} yPosition={100} />
    </div>
  );
};

export default App;
