import React from 'react';
import './Node.css';
import Constants from '../../helpers/Constants';

export interface NodeData {
  xPosition: number;
  yPosition: number;
  value: string;
  selected: boolean;
  algorithmStartOrEndNode: boolean;
  distanceFromStartNode: number;
  visited: boolean;
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

  const getBorderClassForNode = (): string => {
    if (props.nodeData.selected) {
      return 'active-border';
    }
    if (props.nodeData.algorithmStartOrEndNode) {
      return 'start-or-end-algorithm-border';
    }

    if (props.nodeData.visited) {
      return 'visited-border';
    }

    return 'standard-border';
  };

  return (
    <div id="node" className={getBorderClassForNode()} style={positionStyle}>
      <span id="valueText">{props.nodeData.value}</span>
    </div>
  );
};

export default Node;
