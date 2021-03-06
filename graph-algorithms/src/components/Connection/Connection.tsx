import React from 'react';
import { NodeData } from '../Node/Node';
import './Connection.css';
import Constants from '../../helpers/Constants';

export interface ConnectionData {
  startNode: NodeData;
  endNode: NodeData;
  weight: string;
  selected: boolean;
}

interface ConnectionProps {
  data: ConnectionData;
}

const getCenterX = (node: NodeData) => {
  return node.xPosition + Constants.NODE_SIZE / 2;
};

const getCenterY = (node: NodeData) => {
  return node.yPosition + Constants.NODE_SIZE / 2;
};

export const checkIfPointOnConnectionLine = (
  connectionData: ConnectionData,
  xPosition: number,
  yPosition: number
): boolean => {
  const gradient =
    (getCenterY(connectionData.startNode) -
      getCenterY(connectionData.endNode)) /
    (getCenterX(connectionData.startNode) - getCenterX(connectionData.endNode));
  const yIntercept =
    getCenterY(connectionData.startNode) -
    gradient * getCenterX(connectionData.startNode);

  const expectedYPosition = gradient * xPosition + yIntercept;
  return (
    yPosition <= expectedYPosition + Constants.CONNECTION_WIDTH &&
    yPosition >= expectedYPosition - Constants.CONNECTION_WIDTH
  );
};

const Connection = (connectionProps: ConnectionProps) => {
  const getNodeCenterPosition = (position: number): number => {
    return position + Constants.NODE_SIZE / 2;
  };

  const getConnectionLength = (): number => {
    let xCalculation =
      getNodeCenterPosition(connectionProps.data.startNode.xPosition) -
      getNodeCenterPosition(connectionProps.data.endNode.xPosition);
    xCalculation *= xCalculation;

    let yCalculation =
      getNodeCenterPosition(connectionProps.data.startNode.yPosition) -
      getNodeCenterPosition(connectionProps.data.endNode.yPosition);
    yCalculation *= yCalculation;

    return Math.sqrt(xCalculation + yCalculation);
  };

  const getLineAngle = () => {
    const yComponent =
      getNodeCenterPosition(connectionProps.data.endNode.yPosition) -
      getNodeCenterPosition(connectionProps.data.startNode.yPosition);
    const xComponent =
      getNodeCenterPosition(connectionProps.data.endNode.xPosition) -
      getNodeCenterPosition(connectionProps.data.startNode.xPosition);
    const arcTan = Math.atan2(yComponent, xComponent);
    return (arcTan * 180) / Math.PI;
  };

  const positionStyle = {
    transform: 'rotate(' + getLineAngle() + 'deg)',
    left:
      getNodeCenterPosition(connectionProps.data.startNode.xPosition) -
      Constants.CONNECTION_WIDTH / 4,
    top: getNodeCenterPosition(connectionProps.data.startNode.yPosition),
    width: getConnectionLength(),
    height: Constants.CONNECTION_WIDTH,
  };

  return (
    <div
      id="connection"
      className={connectionProps.data.selected ? 'selected' : 'not-selected'}
      style={positionStyle}
    >
      <span id="weightDisplay">{connectionProps.data.weight}</span>
    </div>
  );
};

export default Connection;
