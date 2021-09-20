import { NodeData } from '../components/Node/Node';
import { ConnectionIndexData } from './ReduxStore';
import store from '../helpers/ReduxStore';

//NEED TO FIND A WAY OF RETRIVING THE LATEST NODE AND CONNECTION DATA FOR THIS CLASS RATHER THAN JUST PASSING IN ONCE

export enum AlgorithmType {
  DIJKSTRAS,
  A_STAR,
  NONE,
}

export default class Algorithm {
  private type: AlgorithmType;
  private currentNodeIndex: number;
  private nodes: NodeData[];
  private connections: ConnectionIndexData[];
  private initialStep: boolean;

  constructor(
    type: AlgorithmType,
    startNodeIndex: number = 0,
    nodes: NodeData[] = [],
    connections: ConnectionIndexData[] = []
  ) {
    this.type = type;
    this.currentNodeIndex = startNodeIndex;
    this.nodes = nodes;
    this.connections = connections;
    this.initialStep = true;
  }

  private getOutgoingConnectionsForCurrentNode = () => {
    return this.connections.filter(
      (connection) => connection.startNodeIndex === this.currentNodeIndex
    );
  };

  private getConnectionWithShortestDistance = (
    currentConnections: ConnectionIndexData[]
  ): ConnectionIndexData => {
    let shortestConnection: ConnectionIndexData = currentConnections[0];
    for (let i = 1; i < currentConnections.length; i++) {
      if (currentConnections[i].weight < shortestConnection.weight) {
        shortestConnection = currentConnections[i];
      }
    }

    return shortestConnection;
  };

  public performStep = () => {
    if (this.initialStep) {
      store.dispatch({
        type: 'UPDATE-NODE-DISTANCE',
        nodeIndex: this.currentNodeIndex,
        newValue: '0',
      });
      this.initialStep = false;
    } else {
      const currentConnections = this.getOutgoingConnectionsForCurrentNode();
      if (currentConnections.length > 0) {
        const shortestConnection =
          this.getConnectionWithShortestDistance(currentConnections);

        store.dispatch({
          type: 'UPDATE-NODE-DISTANCE',
          nodeIndex: shortestConnection.endNodeIndex,
          newValue:
            this.nodes[this.currentNodeIndex].distanceFromStartNode +
            shortestConnection.weight,
        });
        this.currentNodeIndex = shortestConnection.endNodeIndex;
      }
    }
  };

  public startNewAlogrithm = (
    type: AlgorithmType,
    currentNodeIndex: number = 0,
    nodes: NodeData[],
    connections: ConnectionIndexData[]
  ) => {
    this.type = type;
    this.currentNodeIndex = currentNodeIndex;
    this.nodes = nodes;
    this.connections = connections;
    this.initialStep = true;
  };

  public getAlgorithmType = (): AlgorithmType => {
    return this.type;
  };
}

export const currentAlgorithm = new Algorithm(AlgorithmType.NONE);
