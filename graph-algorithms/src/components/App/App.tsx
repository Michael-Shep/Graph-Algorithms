import React, { useState, useEffect, MouseEvent, useRef } from 'react';
import { connect } from 'react-redux';
import './App.css';
import Node, { NodeData } from '../Node/Node';
import Connection, { ConnectionData } from '../Connection/Connection';
import store, { NodeState } from '../../helpers/ReduxStore';
import Constants from '../../helpers/Constants';
import InformationPanel from '../InformationPanel/InformationPanel';

interface AppProps {
  nodes: NodeData[];
  connectionsData: number[][];
  selectedNodeIndex: number;
}

enum InteractionMode {
  NODE,
  CONNECTION,
}

const App = (props: AppProps) => {
  const graphDisplay = useRef<HTMLDivElement>(null);

  const [interactionMode, setInteractionMode] = useState<InteractionMode>(
    InteractionMode.NODE
  );
  const [informationText, setInformationText] = useState(
    'Select a node to perform actions on it'
  );
  const [modeButtonText, setModeButtonText] = useState(
    'Switch to Connection Mode'
  );
  const [firstSelectedNodeIndex, setFirstSelectedNodeIndex] =
    useState<number>(-1);

  const [isMouseOnNode, setIsMouseOnNode] = useState(false);

  useEffect(() => {
    if (interactionMode === InteractionMode.NODE) {
      setInformationText('Select a node to perform actions on it');
      setModeButtonText('Switch to Connection Mode');
    } else if (interactionMode === InteractionMode.CONNECTION) {
      setInformationText('Select the start node for the connection');
      setModeButtonText('Switch to Node Mode');
    }
  }, [interactionMode]);

  const handleMouseMove = (mouseEvent: MouseEvent) => {
    if (isMouseOnNode) {
      store.dispatch({
        type: 'MOVE-NODE',
        xPosition: mouseEvent.pageX,
        yPosition: mouseEvent.pageY,
      });
    }
  };

  const isMouseInNodeBounds = (
    node: NodeData,
    clickX: number,
    clickY: number
  ): boolean => {
    return (
      node.xPosition <= clickX &&
      node.xPosition + Constants.NODE_SIZE >= clickX &&
      node.yPosition <= clickY &&
      node.yPosition + Constants.NODE_SIZE >= clickY
    );
  };

  const mouseDownHandler = (clickEvent: MouseEvent) => {
    if (interactionMode === InteractionMode.NODE) {
      props.nodes.forEach((node, index) => {
        if (isMouseInNodeBounds(node, clickEvent.pageX, clickEvent.pageY)) {
          setIsMouseOnNode(true);
          store.dispatch({
            type: 'SELECT-NODE',
            nodeIndex: index,
          });
        }
      });
    } else {
      props.nodes.forEach((node, index) => {
        if (isMouseInNodeBounds(node, clickEvent.pageX, clickEvent.pageY)) {
          if (firstSelectedNodeIndex === -1) {
            setInformationText('Now Select End node for connection');
            setFirstSelectedNodeIndex(index);
          } else if (index !== firstSelectedNodeIndex) {
            store.dispatch({
              type: 'ADD-CONNECTION',
              startNodeIndex: firstSelectedNodeIndex,
              endNodeIndex: index,
            });
            setFirstSelectedNodeIndex(-1);
            setInformationText('Select the state node for the connection');
          }
        }
      });
    }
  };

  const runButtonHandler = () => {
    console.log('RUN ALGORITHM');
  };

  const addButtonHandler = () => {
    store.dispatch({ type: 'ADD-NODE' });
  };

  const modeButtonHandler = () => {
    if (interactionMode === InteractionMode.NODE) {
      setInteractionMode(InteractionMode.CONNECTION);
    } else setInteractionMode(InteractionMode.NODE);
  };

  const isValidNodeIndex = (index: number): boolean => {
    return index >= 0 && index < props.nodes.length;
  };

  return (
    <div id="app">
      <div id="header">
        <h1>Graph Algorithm Visualiser</h1>
      </div>
      <div id="body">
        <div
          id="graphDisplay"
          onMouseMove={handleMouseMove}
          onMouseDown={mouseDownHandler}
          onMouseUp={() => setIsMouseOnNode(false)}
          ref={graphDisplay}
        >
          <button onClick={addButtonHandler} className="buttonStyle">
            Add Node
          </button>
          <button onClick={runButtonHandler} className="buttonStyle">
            Run Algorithm
          </button>
          <button onClick={modeButtonHandler} className="buttonStyle">
            {modeButtonText}
          </button>
          <p id="informationText">{informationText}</p>
          {props.connectionsData.map((connectionData, index) => {
            if (
              connectionData.length === 3 &&
              isValidNodeIndex(connectionData[0]) &&
              isValidNodeIndex(connectionData[1])
            ) {
              const data: ConnectionData = {
                startNode: props.nodes[connectionData[0]],
                endNode: props.nodes[connectionData[1]],
                weight: connectionData[2],
              };
              return <Connection data={data} key={index + 'C'} />;
            }
          })}
          {props.nodes.map((nodeData, index) => (
            <Node nodeData={nodeData} key={index} />
          ))}
        </div>
        <InformationPanel />
      </div>
    </div>
  );
};

const mapStateToProps = (state: NodeState) => ({
  nodes: state.nodes,
  connectionsData: state.connectionsData,
  selectedNodeIndex: state.selectedNodeIndex,
});

export default connect(mapStateToProps)(App);
