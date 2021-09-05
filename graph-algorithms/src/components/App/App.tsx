import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import './App.css';
import Node, { NodeData } from '../Node/Node';
import Connection from '../Connection/Connection';
import store, { NodeState } from '../../helpers/ReduxStore';

interface AppProps {
  nodes: NodeData[];
}

const App = (props: AppProps) => {
  useEffect(() => {
    document.addEventListener('mousemove', (mouseEvent) => {
      store.dispatch({
        type: 'MOVE-NODE',
        xPosition: mouseEvent.pageX,
        yPosition: mouseEvent.pageY,
      });
    });
    document.addEventListener('click', (clickEvent) => {
      store.dispatch({
        type: 'SELECT-NODE',
        xPosition: clickEvent.pageX,
        yPosition: clickEvent.pageY,
      });
    });
  }, []);

  const runButtonHandler = () => {
    console.log('RUN ALGORITHM');
  };

  const addButtonHandler = () => {
    store.dispatch({ type: 'ADD-NODE' });
  };

  return (
    <div id="app">
      <div id="header">
        <h1>Graph Algorithm Visualiser</h1>
      </div>
      <div id="body">
        <button onClick={addButtonHandler} className="buttonStyle">
          Add Node
        </button>
        <button onClick={runButtonHandler} className="buttonStyle">
          Run Algorithm
        </button>
        <Connection startNode={props.nodes[0]} endNode={props.nodes[1]} />
        {props.nodes.map((nodeData, index) => (
          <Node nodeData={nodeData} key={index} />
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = (state: NodeState) => ({
  nodes: state.nodes,
});

export default connect(mapStateToProps)(App);
