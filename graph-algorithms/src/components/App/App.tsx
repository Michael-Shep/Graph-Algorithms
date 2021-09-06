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
  connectionIndexes: number[][];
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

  useEffect(() => {
    document.addEventListener('mousemove', (mouseEvent) => {
      const element = graphDisplay.current;
      if (
        element !== null &&
        mouseEvent.pageX - Constants.NODE_SIZE >= element!.clientLeft &&
        mouseEvent.pageX + Constants.NODE_SIZE <=
          element!.offsetLeft + element!.clientWidth &&
        mouseEvent.pageY - Constants.NODE_SIZE >= element!.clientTop &&
        mouseEvent.pageY + Constants.NODE_SIZE <=
          element!.offsetTop + element!.clientHeight
      ) {
        console.log('Code Working');
        store.dispatch({
          type: 'MOVE-NODE',
          xPosition: mouseEvent.pageX,
          yPosition: mouseEvent.pageY,
        });
      }
    });
  }, []);

  useEffect(() => {
    if (interactionMode === InteractionMode.NODE) {
      setInformationText('Select a node to perform actions on it');
      setModeButtonText('Switch to Connection Mode');
    } else if (interactionMode === InteractionMode.CONNECTION) {
      setInformationText('Select the start node for the connection');
      setModeButtonText('Switch to Node Mode');
    }
  }, [interactionMode]);

  const clickHandler = (clickEvent: MouseEvent<HTMLDivElement>) => {
    if (interactionMode === InteractionMode.NODE) {
      store.dispatch({
        type: 'SELECT-NODE',
        xPosition: clickEvent.pageX,
        yPosition: clickEvent.pageY,
      });
    } else {
      props.nodes.forEach((node, index) => {
        if (
          node.xPosition <= clickEvent.pageX &&
          node.xPosition + Constants.NODE_SIZE >= clickEvent.pageX &&
          node.yPosition <= clickEvent.pageY &&
          node.yPosition + Constants.NODE_SIZE >= clickEvent.pageY
        ) {
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
        <div id="graphDisplay" onClick={clickHandler} ref={graphDisplay}>
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
          {props.connectionIndexes.map((connectionNodes, index) => {
            if (
              connectionNodes.length === 2 &&
              isValidNodeIndex(connectionNodes[0]) &&
              isValidNodeIndex(connectionNodes[1])
            ) {
              const data: ConnectionData = {
                startNode: props.nodes[connectionNodes[0]],
                endNode: props.nodes[connectionNodes[1]],
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
  connectionIndexes: state.connectionIndexes,
});

export default connect(mapStateToProps)(App);
