import { createStore } from 'redux';
import { NodeData } from '../components/Node/Node';
import {
  handleSelectNode,
  handleAddNode,
  handleMoveNode,
  handleUpdateNodeValue,
  handleDeleteNode,
  clearAllSelections,
  handleSelectNodeForAlgorithm,
  handleUpdateNodeDistance,
} from './NodeStateHandler';
import {
  handleUpdateConnectionWeight,
  handleAddConnection,
  handleSelectConnection,
  handleDeleteConnection,
} from './ConnectionStateHandler';

export interface ConnectionIndexData {
  startNodeIndex: number;
  endNodeIndex: number;
  weight: string;
  selected: boolean;
}

export interface GraphState {
  nodes: NodeData[];
  connectionsData: ConnectionIndexData[];
  selectedNodeIndex: number;
  selectedConnectionIndex: number;
}

export interface GraphAction {
  type: String;
  nodeIndex?: number;
  connectionIndex?: number;
  xPosition?: number;
  yPosition?: number;
  startNodeIndex?: number;
  endNodeIndex?: number;
  newValue?: string;
}

const initialState: GraphState = {
  nodes: [
    {
      xPosition: 100,
      yPosition: 500,
      value: '1',
      selected: false,
      algorithmStartOrEndNode: false,
      distanceFromStartNode: -1,
    },
    {
      xPosition: 200,
      yPosition: 600,
      value: '2',
      selected: false,
      algorithmStartOrEndNode: false,
      distanceFromStartNode: -1,
    },
  ],
  connectionsData: [],
  selectedNodeIndex: -1,
  selectedConnectionIndex: -1,
};

const reducer = (
  state: GraphState = initialState,
  action: GraphAction
): GraphState => {
  switch (action.type) {
    case 'SELECT-NODE':
      return handleSelectNode(state, action);
    case 'ADD-NODE':
      return handleAddNode(state);
    case 'MOVE-NODE':
      return handleMoveNode(state, action);
    case 'UPDATE-NODE-VALUE':
      return handleUpdateNodeValue(state, action);
    case 'UPDATE-NODE-DISTANCE':
      return handleUpdateNodeDistance(state, action);
    case 'DELETE-NODE':
      return handleDeleteNode(state);
    case 'SELECT-ALGORITHM-NODE':
      return handleSelectNodeForAlgorithm(state, action);
    case 'ADD-CONNECTION':
      return handleAddConnection(state, action);
    case 'SELECT-CONNECTION':
      return handleSelectConnection(state, action);
    case 'UPDATE-CONNECTION-WEIGHT':
      return handleUpdateConnectionWeight(state, action);
    case 'DELETE-CONNECTION':
      return handleDeleteConnection(state);
    case 'CLEAR-SELECTIONS':
      return clearAllSelections(state);
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;
