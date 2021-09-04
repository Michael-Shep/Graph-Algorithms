import React from 'react';
import './Node.css';
import Constants from '../../helpers/Constants';

export interface NodeData {
  xPosition: number;
  yPosition: number;
  value: number;
  active: boolean;
}

interface NodeProps {
  nodeData: NodeData;
}

const Node = (props: NodeProps) => {
  const positionStyle = {
    left: props.nodeData.xPosition,
    top: props.nodeData.yPosition,
    width: Constants.NODE_SIZE,
    height: Constants.NODE_SIZE,
  };

  return (
    <div
      id="node"
      className={props.nodeData.active ? 'active-border' : 'standard-border'}
      style={positionStyle}
    >
      <span id="valueText">{props.nodeData.value}</span>
    </div>
  );
};

export default Node;
