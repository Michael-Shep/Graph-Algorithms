import React from 'react';
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

  return (
    <div>
      {props.visible && (
        <div id="popup" style={getPositionStyling()}>
          <h2>Select Algorithm to Perform</h2>
        </div>
      )}
    </div>
  );
};

export default AlgorithmSelectionPopup;
