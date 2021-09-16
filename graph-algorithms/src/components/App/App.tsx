import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import './App.css';
import Node, { NodeData } from '../Node/Node';
import Connection, { ConnectionData } from '../Connection/Connection';
import store, {
  ConnectionIndexData,
  GraphState,
} from '../../helpers/ReduxStore';
import Constants from '../../helpers/Constants';
import InformationPanel from '../InformationPanel/InformationPanel';
import AlgorithmSelectionPopup from '../AlogrithmSelectionPopup/AlgorithmSelectionPopup';
import useWindowSize, { Size } from '../../helpers/useWindowSize';
import {
  handleMouseMove,
  mouseDownHandler,
} from '../../helpers/MouseEventHandler';

interface AppProps {
  nodes: NodeData[];
  connectionsData: ConnectionIndexData[];
  selectedNodeIndex: number;
}

export enum InteractionMode {
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
  const [selectionPopupVisible, setSelectionPopupVisible] = useState(false);
  const size: Size = useWindowSize();

  useEffect(() => {
    if (interactionMode === InteractionMode.SELECTION) {
      setInformationText(Constants.SELECTION_MODE_INFORMATION_TEXT);
      setModeButtonText(Constants.SWITCH_TO_CONNECTION_TEXT);
    } else if (interactionMode === InteractionMode.NEW_CONNECTION) {
      setInformationText(Constants.CONNECTION_START_NODE_TEXT);
      setModeButtonText(Constants.CANCEL_CONNECTION_TEXT);
    }
  }, [interactionMode]);

  const runButtonHandler = () => {
    setSelectionPopupVisible(true);
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
          onMouseMove={(event) =>
            handleMouseMove(
              event,
              selectionPopupVisible,
              isMouseOnNode,
              graphDisplay.current!
            )
          }
          onMouseDown={(event) =>
            mouseDownHandler(
              event,
              props.nodes,
              props.connectionsData,
              selectionPopupVisible,
              interactionMode,
              graphDisplay.current!,
              firstSelectedNodeIndex,
              size,
              setIsMouseOnNode,
              setInformationText,
              setFirstSelectedNodeIndex,
              setInteractionMode,
              setSelectionPopupVisible
            )
          }
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
        <AlgorithmSelectionPopup visible={selectionPopupVisible} />
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
