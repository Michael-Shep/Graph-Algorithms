import React from 'react';
import './App.css';
import Node, { NodeData } from '../Node/Node';
import Connection from '../Connection/Connection';
import useWindowSize, { Size } from '../../helpers/useWindowSize';
import Constants from '../../helpers/Constants';

const App = () => {
  const size: Size = useWindowSize();

  const getCenterXPosition = (): number => {
    if (size.width) {
      return size.width / 2 - Constants.NODE_SIZE / 2;
    }
    return 0;
  };

  const node1Data: NodeData = new NodeData(getCenterXPosition(), 200);
  const node2Data: NodeData = new NodeData(getCenterXPosition() + 200, 700);

  return (
    <div id="app">
      <h1>Graph Algorithm Visualiser</h1>
      <Connection startNode={node1Data} endNode={node2Data} />
      <Node nodeData={node1Data} />
      <Node nodeData={node2Data} />
    </div>
  );
};

export default App;
