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

  private getConnectionsForCurrentNode = () => {
    return this.connections.filter(
      (connection) =>
        (connection.startNodeIndex === this.currentNodeIndex &&
          !this.nodes[connection.endNodeIndex].visited) ||
        (connection.endNodeIndex === this.currentNodeIndex &&
          !this.nodes[connection.endNodeIndex].visited)
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
      this.nodes[this.currentNodeIndex].distanceFromStartNode = 0;
      this.initialStep = false;
    } else {
      const currentConnections = this.getConnectionsForCurrentNode();
      if (currentConnections.length > 0) {
        const shortestConnection =
          this.getConnectionWithShortestDistance(currentConnections);
        const newNodeIndex =
          shortestConnection.startNodeIndex == this.currentNodeIndex
            ? shortestConnection.endNodeIndex
            : shortestConnection.startNodeIndex;

        store.dispatch({
          type: 'UPDATE-NODE-DISTANCE',
          nodeIndex: newNodeIndex,
          newValue: String(
            Number(this.nodes[this.currentNodeIndex].distanceFromStartNode) +
              Number(shortestConnection.weight)
          ),
        });
        //Need to come up with a better solution than this for updating nodes - this should just be a temporary fix
        this.nodes[newNodeIndex].distanceFromStartNode =
          Number(this.nodes[this.currentNodeIndex].distanceFromStartNode) +
          Number(shortestConnection.weight);
        this.nodes[newNodeIndex].visited = true;
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

  public stopCurrentAlgorithm = () => {
    this.type = AlgorithmType.NONE;
  };

  public getAlgorithmType = (): AlgorithmType => {
    return this.type;
  };
}

export const currentAlgorithm = new Algorithm(AlgorithmType.NONE);
