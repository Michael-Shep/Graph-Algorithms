import React from 'react';
import './App.css';
import Node from './Node';
import useWindowSize, { Size } from '../helpers/useWindowSize';
import Constants from '../helpers/Constants';

const App = () => {
  const size: Size = useWindowSize();

  const getCenterXPosition = (): number => {
    if (size.width) {
      return size.width / 2 - Constants.NODE_SIZE / 2;
    }
    return 0;
  };

  return (
    <div id="app">
      <h1>Graph Algorithm Visualiser</h1>
      <Node xPosition={getCenterXPosition()} yPosition={100} />
    </div>
  );
};

export default App;
