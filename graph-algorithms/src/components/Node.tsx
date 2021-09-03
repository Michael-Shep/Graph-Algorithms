import React from 'react';
import './Node.css';
import Constants from '../helpers/Constants';

interface NodeProps {
  xPosition: number;
  yPosition: number;
}

const Node = (props: NodeProps) => {
  const positionStyle = {
    left: props.xPosition,
    top: props.yPosition,
    width: Constants.NODE_SIZE,
    height: Constants.NODE_SIZE,
  };

  return <div id="node" style={positionStyle}></div>;
};

export default Node;
