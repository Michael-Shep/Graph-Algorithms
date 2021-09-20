import { NodeData } from '../components/Node/Node';
import { ConnectionIndexData } from './ReduxStore';

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
  }

  private getConnectionsForCurrentNode = () => {
    return this.connections.map(
      (connection) =>
        connection.startNodeIndex === this.currentNodeIndex ||
        connection.endNodeIndex === this.currentNodeIndex
    );
  };

  public performStep = () => {
    console.log(this.connections);
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
  };

  public getAlgorithmType = (): AlgorithmType => {
    return this.type;
  };
}

export const currentAlgorithm = new Algorithm(AlgorithmType.NONE);
