import React, { MouseEvent } from 'react';
import useWindowSize, { Size } from '../../helpers/useWindowSize';
import './AlgorithmSelectionPopup.css';
import Constants from '../../helpers/Constants';

interface AlgorithmSelectionProps {
  visible: boolean;
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
    console.log(event.currentTarget.value);
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

export default AlgorithmSelectionPopup;
