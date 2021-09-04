import React from 'react';
import { NodeData } from '../Node/Node';
import './Connection.css';
import Constants from '../../helpers/Constants';

interface ConnectionProps {
  startNode: NodeData;
  endNode: NodeData;
}

const Connection = (connectionProps: ConnectionProps) => {
  const getNodeCenterPosition = (position: number): number => {
    return position + Constants.NODE_SIZE / 2;
  };

  const getConnectionLength = (): number => {
    let xCalculation =
      getNodeCenterPosition(connectionProps.startNode.xPosition) -
      getNodeCenterPosition(connectionProps.startNode.yPosition);
    xCalculation *= xCalculation;

    let yCalculation =
      getNodeCenterPosition(connectionProps.startNode.yPosition) -
      getNodeCenterPosition(connectionProps.endNode.yPosition);
    yCalculation *= yCalculation;

    return Math.sqrt(xCalculation + yCalculation);
  };

  const getLineAngle = () => {
    const yComponent =
      getNodeCenterPosition(connectionProps.endNode.yPosition) -
      getNodeCenterPosition(connectionProps.startNode.yPosition);
    const xComponent =
      getNodeCenterPosition(connectionProps.endNode.xPosition) -
      getNodeCenterPosition(connectionProps.startNode.xPosition);
    const arcTan = Math.atan2(yComponent, xComponent);
    return (arcTan * 180) / Math.PI;
  };

  const positionStyle = {
    transform: 'rotate(' + getLineAngle() + 'deg)',
    left:
      getNodeCenterPosition(connectionProps.startNode.xPosition) -
      Constants.CONNECTION_WIDTH / 4,
    top: getNodeCenterPosition(connectionProps.startNode.yPosition),
    width: getConnectionLength(),
    height: Constants.CONNECTION_WIDTH,
  };

  return <div id="connection" style={positionStyle}></div>;
};

export default Connection;
