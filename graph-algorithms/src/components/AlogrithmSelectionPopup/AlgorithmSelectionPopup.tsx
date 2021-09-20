import React, { MouseEvent } from 'react';
import useWindowSize, { Size } from '../../helpers/useWindowSize';
import { connect } from 'react-redux';
import './AlgorithmSelectionPopup.css';
import Constants from '../../helpers/Constants';
import { AlgorithmType, currentAlgorithm } from '../../helpers/Algorithm';
import { InteractionMode } from '../App/App';
import store, {
  GraphState,
  ConnectionIndexData,
} from '../../helpers/ReduxStore';
import { NodeData } from '../Node/Node';

interface AlgorithmSelectionProps {
  visible: boolean;
  setSelectionPopupVisible: (value: boolean) => void;
  setInteractionMode: (value: InteractionMode) => void;
  nodes: NodeData[];
  connectionsData: ConnectionIndexData[];
}

const AlgorithmSelectionPopup = (props: AlgorithmSelectionProps) => {
  const size: Size = useWindowSize();

  const getPositionStyling = () => {
    if (size.width && size.height) {
      return {
        left: size.width / 2 - Constants.ALGORITHM_POPUP_WIDTH / 2,
        top: size.height / 2 - Constants.ALGORITHM_POPUP_HEIGHT / 2,
        width: Constants.ALGORITHM_POPUP_WIDTH,
        height: Constants.ALGORITHM_POPUP_HEIGHT,
      };
    }
    return {};
  };

  const handleButtonPress = (event: MouseEvent<HTMLButtonElement>) => {
    currentAlgorithm.startNewAlogrithm(
      AlgorithmType.DIJKSTRAS,
      0,
      props.nodes,
      props.connectionsData
    );
    props.setSelectionPopupVisible(false);
    props.setInteractionMode(InteractionMode.START_NODE_SELECTION);
    store.dispatch({ type: 'CLEAR-SELECTIONS' });
  };

  return (
    <div>
      {props.visible && (
        <div id="popup" style={getPositionStyling()}>
          <h2>Select Algorithm to Perform</h2>
          <button
            className="optionButton"
            value="dijkstra"
            onClick={handleButtonPress}
          >
            Dijkstra&apos;s Search Algorithm
          </button>
          <button
            className="optionButton"
            value="astar"
            onClick={handleButtonPress}
          >
            A* Search Algorithm
          </button>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: GraphState) => ({
  nodes: state.nodes,
  connectionsData: state.connectionsData,
});

export default connect(mapStateToProps)(AlgorithmSelectionPopup);
