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
import { currentAlgorithm } from '../../helpers/Algorithm';

interface AppProps {
  nodes: NodeData[];
  connectionsData: ConnectionIndexData[];
  selectedNodeIndex: number;
}

export enum InteractionMode {
  SELECTION,
  NEW_CONNECTION,
  START_NODE_SELECTION,
  END_NODE_SELECTION,
  ALGORITHM,
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
  const [algorithmStartNodeIndex, setAlgorithmStartNodeIndex] = useState(0);
  const size: Size = useWindowSize();

  useEffect(() => {
    if (interactionMode === InteractionMode.SELECTION) {
      setInformationText(Constants.SELECTION_MODE_INFORMATION_TEXT);
      setModeButtonText(Constants.SWITCH_TO_CONNECTION_TEXT);
    } else if (interactionMode === InteractionMode.NEW_CONNECTION) {
      setInformationText(Constants.CONNECTION_START_NODE_TEXT);
      setModeButtonText(Constants.CANCEL_CONNECTION_TEXT);
    } else if (interactionMode === InteractionMode.START_NODE_SELECTION) {
      setInformationText(Constants.START_NODE_SELECTION_TEXT);
    } else if (interactionMode === InteractionMode.END_NODE_SELECTION) {
      setInformationText(Constants.END_NODE_SELECTION_TEXT);
    } else if (interactionMode === InteractionMode.ALGORITHM) {
      setInformationText(Constants.ALGORITHM_MODE_TEXT);
      setModeButtonText(Constants.ALGORITHM_COMPLETE_BUTTON_TEXT);
    }
  }, [interactionMode]);

  const runCancelButtonHandler = () => {
    if (interactionMode !== InteractionMode.ALGORITHM) {
      setSelectionPopupVisible(true);
    } else {
      store.dispatch({ type: 'CLEAR-SELECTIONS' });
      setInteractionMode(InteractionMode.SELECTION);
      currentAlgorithm.stopCurrentAlgorithm();
    }
  };

  const addStepButtonHandler = () => {
    if (interactionMode !== InteractionMode.ALGORITHM) {
      store.dispatch({ type: 'ADD-NODE' });
    } else {
      currentAlgorithm.performStep();
    }
  };

  const modeSkipButtonHandler = () => {
    if (interactionMode === InteractionMode.SELECTION) {
      setInteractionMode(InteractionMode.NEW_CONNECTION);
    } else if (interactionMode === InteractionMode.NEW_CONNECTION) {
      setInteractionMode(InteractionMode.SELECTION);
    } else if (interactionMode === InteractionMode.ALGORITHM) {
      console.log('Skip to end of alogrithm');
    }
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
              setSelectionPopupVisible,
              setAlgorithmStartNodeIndex
            )
          }
          onMouseUp={() => setIsMouseOnNode(false)}
          ref={graphDisplay}
        >
          <button onClick={addStepButtonHandler} className="buttonStyle">
            {interactionMode === InteractionMode.ALGORITHM
              ? 'Perform Step'
              : 'Add Node'}
          </button>
          <button onClick={modeSkipButtonHandler} className="buttonStyle">
            {modeButtonText}
          </button>
          <button onClick={runCancelButtonHandler} className="buttonStyle">
            {interactionMode === InteractionMode.ALGORITHM
              ? 'Cancel Algorithm'
              : 'Run Algorithm'}
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
        <AlgorithmSelectionPopup
          visible={selectionPopupVisible}
          setSelectionPopupVisible={setSelectionPopupVisible}
          setInteractionMode={setInteractionMode}
          algorithmStartNodeIndex={algorithmStartNodeIndex}
        />
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
