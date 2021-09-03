import React from 'react';
import './Node.css';
import Constants from '../../helpers/Constants';

export class NodeData {
  private xPosition: number;
  private yPosition: number;

  constructor(xPosition: number, yPosition: number) {
    this.xPosition = xPosition;
    this.yPosition = yPosition;
  }

  public getCenterX(): number {
    return this.xPosition + Constants.NODE_SIZE / 2;
  }

  public getCenterY(): number {
    return this.yPosition + Constants.NODE_SIZE / 2;
  }

  public getXPosition(): number {
    return this.xPosition;
  }

  public getYPosition(): number {
    return this.yPosition;
  }
}

interface NodeProps {
  nodeData: NodeData;
}

const Node = (props: NodeProps) => {
  const positionStyle = {
    left: props.nodeData.getXPosition(),
    top: props.nodeData.getYPosition(),
    width: Constants.NODE_SIZE,
    height: Constants.NODE_SIZE,
  };

  return <div id="node" style={positionStyle}></div>;
};

export default Node;
