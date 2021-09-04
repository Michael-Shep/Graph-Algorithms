import React from 'react';
import './Node.css';
import Constants from '../../helpers/Constants';

export interface NodeData {
  xPosition: number;
  yPosition: number;
  value: number;
  active: boolean;
}

/*export class NodeData {
  private xPosition: number;
  private yPosition: number;
  private value: number;
  private active: boolean;

  constructor(
    xPosition: number,
    yPosition: number,
    value: number,
    active: boolean = false
  ) {
    this.xPosition = xPosition;
    this.yPosition = yPosition;
    this.value = value;
    this.active = active;
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

  public getValue(): number {
    return this.value;
  }

  public isActive(): boolean {
    return this.active;
  }

  public setActive(active: boolean) {
    this.active = active;
  }
}*/

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
