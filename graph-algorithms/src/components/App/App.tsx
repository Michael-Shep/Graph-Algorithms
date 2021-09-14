import React, { useState, useEffect, MouseEvent, useRef } from 'react';
import { connect } from 'react-redux';
import './App.css';
import Node, { NodeData } from '../Node/Node';
import Connection, {
  ConnectionData,
  checkIfPointOnConnectionLine,
} from '../Connection/Connection';
import store, {
  ConnectionIndexData,
  GraphState,
} from '../../helpers/ReduxStore';
import Constants from '../../helpers/Constants';
import InformationPanel from '../InformationPanel/InformationPanel';

interface AppProps {
  nodes: NodeData[];
  connectionsData: ConnectionIndexData[];
  selectedNodeIndex: number;
}

enum InteractionMode {
  SELECTION,
  NEW_CONNECTION,
}

const App = (props: AppProps) => {
  const graphDisplay = useRef<HTMLDivElement>(null);

  const [interactionMode, setInteractionMode] = useState<InteractionMode>(
    InteractionMode.SELECTION
  );
  const [informationText, setInformationText] = useState(
    Constants.SELECTION_MODE_INFORMATION_TEXT
  );
  const [modeButtonText, setModeButtonText] = useState(
    Constants.SWITCH_TO_CONNECTION_TEXT
  );
  const [firstSelectedNodeIndex, setFirstSelectedNodeIndex] =
    useState<number>(-1);

  const [isMouseOnNode, setIsMouseOnNode] = useState(false);

  useEffect(() => {
    if (interactionMode === InteractionMode.SELECTION) {
      setInformationText(Constants.SELECTION_MODE_INFORMATION_TEXT);
      setModeButtonText(Constants.SWITCH_TO_CONNECTION_TEXT);
    } else if (interactionMode === InteractionMode.NEW_CONNECTION) {
      setInformationText(Constants.CONNECTION_START_NODE_TEXT);
      setModeButtonText(Constants.CANCEL_CONNECTION_TEXT);
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
    if (interactionMode === InteractionMode.SELECTION) {
      let selectionMade = false;
      props.nodes.forEach((node, index) => {
        if (isMouseInNodeBounds(node, clickEvent.pageX, clickEvent.pageY)) {
          setIsMouseOnNode(true);
          store.dispatch({
            type: 'SELECT-NODE',
            nodeIndex: index,
          });
          selectionMade = true;
          return;
        }
      });
      if (!selectionMade) {
        props.connectionsData.forEach((connectionIndexData, index) => {
          if (
            checkIfPointOnConnectionLine(
              {
                startNode: props.nodes[connectionIndexData.startNodeIndex],
                endNode: props.nodes[connectionIndexData.endNodeIndex],
                weight: connectionIndexData.weight,
                selected: connectionIndexData.selected,
              },
              clickEvent.pageX,
              clickEvent.pageY
            )
          ) {
            store.dispatch({
              type: 'SELECT-CONNECTION',
              connectionIndex: index,
            });
            return;
          }
        });
      }
    } else {
      props.nodes.forEach((node, index) => {
        if (isMouseInNodeBounds(node, clickEvent.pageX, clickEvent.pageY)) {
          if (firstSelectedNodeIndex === -1) {
            setInformationText(Constants.CONNECTION_END_NODE_TEXT);
            setFirstSelectedNodeIndex(index);
          } else if (index !== firstSelectedNodeIndex) {
            store.dispatch({
              type: 'ADD-CONNECTION',
              startNodeIndex: firstSelectedNodeIndex,
              endNodeIndex: index,
            });
            setFirstSelectedNodeIndex(-1);
            setInteractionMode(InteractionMode.SELECTION);
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
    if (interactionMode === InteractionMode.SELECTION) {
      setInteractionMode(InteractionMode.NEW_CONNECTION);
    } else setInteractionMode(InteractionMode.SELECTION);
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
          <button onClick={modeButtonHandler} className="buttonStyle">
            {modeButtonText}
          </button>
          <button onClick={runButtonHandler} className="buttonStyle">
            Run Algorithm
          </button>
          <p id="informationText">{informationText}</p>
          {props.connectionsData.map((connectionIndexData, index) => {
            if (
              isValidNodeIndex(connectionIndexData.startNodeIndex) &&
              isValidNodeIndex(connectionIndexData.endNodeIndex)
            ) {
              const data: ConnectionData = {
                startNode: props.nodes[connectionIndexData.startNodeIndex],
                endNode: props.nodes[connectionIndexData.endNodeIndex],
                weight: connectionIndexData.weight,
                selected: connectionIndexData.selected,
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

const mapStateToProps = (state: GraphState) => ({
  nodes: state.nodes,
  connectionsData: state.connectionsData,
  selectedNodeIndex: state.selectedNodeIndex,
});

export default connect(mapStateToProps)(App);
