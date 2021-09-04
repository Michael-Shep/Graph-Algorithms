import React from 'react';
import { connect } from 'react-redux';
import './App.css';
import Node, { NodeData } from '../Node/Node';
import Connection from '../Connection/Connection';
import store, { NodeState } from '../../helpers/ReduxStore';

interface AppProps {
  nodes: NodeData[];
}

const App = (props: AppProps) => {
  const buttonPressHandler = () => {
    store.dispatch({ type: 'FLIP-ACTIVE', nodeIndex: 1 });
    store.dispatch({ type: 'FLIP-ACTIVE', nodeIndex: 0 });
  };

  return (
    <div id="app">
      <h1>Graph Algorithm Visualiser</h1>
      <button onClick={buttonPressHandler}>Press to update state</button>
      <Connection startNode={props.nodes[0]} endNode={props.nodes[1]} />
      <Node nodeData={props.nodes[0]} />
      <Node nodeData={props.nodes[1]} />
    </div>
  );
};

const mapStateToProps = (state: NodeState) => ({
  nodes: state.nodes,
});

export default connect(mapStateToProps)(App);
