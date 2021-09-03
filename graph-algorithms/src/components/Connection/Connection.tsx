import React from 'react';
import { NodeData } from '../Node/Node';
import './Connection.css';
import Constants from '../../helpers/Constants';

interface ConnectionProps {
  startNode: NodeData;
  endNode: NodeData;
}

const Connection = (connectionProps: ConnectionProps) => {
  const getConnectionLength = (): number => {
    let xCalculation =
      connectionProps.startNode.getCenterX() -
      connectionProps.endNode.getCenterX();
    xCalculation *= xCalculation;

    let yCalculation =
      connectionProps.startNode.getYPosition() -
      connectionProps.endNode.getYPosition();
    yCalculation *= yCalculation;

    return Math.sqrt(xCalculation + yCalculation);
  };

  const getLineAngle = () => {
    const yComponent =
      connectionProps.endNode.getCenterY() -
      connectionProps.startNode.getCenterY();
    const xComponent =
      connectionProps.endNode.getCenterX() -
      connectionProps.startNode.getCenterX();
    const arcTan = Math.atan2(yComponent, xComponent);
    return (arcTan * 180) / Math.PI;
  };

  const positionStyle = {
    transform: 'rotate(' + getLineAngle() + 'deg)',
    left:
      connectionProps.startNode.getCenterX() - Constants.CONNECTION_WIDTH / 4,
    top: connectionProps.startNode.getCenterY(),
    width: getConnectionLength(),
    height: Constants.CONNECTION_WIDTH,
  };

  return <div id="connection" style={positionStyle}></div>;
};

export default Connection;
