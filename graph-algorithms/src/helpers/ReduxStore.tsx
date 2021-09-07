import { createStore } from 'redux';
import { NodeData } from '../components/Node/Node';
import Constants from './Constants';

export interface NodeState {
  nodes: NodeData[];
  connectionIndexes: number[][];
  selectedNodeIndex: number;
}

export interface NodeAction {
  type: String;
  nodeIndex?: number;
  xPosition?: number;
  yPosition?: number;
  startNodeIndex?: number;
  endNodeIndex?: number;
}

const initialState: NodeState = {
  nodes: [
    { xPosition: 100, yPosition: 500, value: 1, selected: false },
    { xPosition: 200, yPosition: 600, value: 2, selected: false },
  ],
  connectionIndexes: [],
  selectedNodeIndex: -1,
};

const handleSelectNode = (state: NodeState, action: NodeAction): NodeState => {
  if (
    action.nodeIndex === undefined ||
    action.nodeIndex <= -1 ||
    action.nodeIndex >= state.nodes.length ||
    action.nodeIndex === state.selectedNodeIndex
  ) {
    return state;
  }

  const newlySelected = !state.nodes[action.nodeIndex!].selected;
  const newNodes = [
    ...state.nodes.slice(0, action.nodeIndex!),
    {
      ...state.nodes[action.nodeIndex!],
      selected: !state.nodes[action.nodeIndex!].selected,
    },
    ...state.nodes.slice(action.nodeIndex! + 1),
  ];

  //Clear the previously selected node
  if (newlySelected && state.selectedNodeIndex !== -1) {
    newNodes[state.selectedNodeIndex].selected = false;
  }

  return {
    nodes: newNodes,
    connectionIndexes: state.connectionIndexes,
    selectedNodeIndex: newlySelected ? action.nodeIndex : -1,
  };
};

const handleAddNode = (state: NodeState): NodeState => {
  return {
    nodes: state.nodes.concat([
      {
        xPosition: Constants.NEW_NODE_X_POSITION,
        yPosition: Constants.NEW_NODE_Y_POSITION,
        value: 0,
        selected: false,
      },
    ]),
    connectionIndexes: state.connectionIndexes,
    selectedNodeIndex: state.selectedNodeIndex,
  };
};

const handleMoveNode = (state: NodeState, action: NodeAction): NodeState => {
  if (
    state.selectedNodeIndex === -1 ||
    action.xPosition === undefined ||
    action.yPosition === undefined
  ) {
    return state;
  }

  return {
    nodes: [
      ...state.nodes.slice(0, state.selectedNodeIndex),
      {
        ...state.nodes[state.selectedNodeIndex],
        xPosition: action.xPosition - Constants.NODE_SIZE / 2,
        yPosition: action.yPosition - Constants.NODE_SIZE / 2,
      },
      ...state.nodes.slice(state.selectedNodeIndex + 1),
    ],
    connectionIndexes: state.connectionIndexes,
    selectedNodeIndex: state.selectedNodeIndex,
  };
};

const handleAddConnection = (
  state: NodeState,
  action: NodeAction
): NodeState => {
  if (
    action.startNodeIndex === undefined ||
    action.endNodeIndex === undefined
  ) {
    return state;
  }
  return {
    nodes: state.nodes,
    connectionIndexes: state.connectionIndexes.concat([
      [action.startNodeIndex!, action.endNodeIndex!],
    ]),
    selectedNodeIndex: state.selectedNodeIndex,
  };
};

const reducer = (
  state: NodeState = initialState,
  action: NodeAction
): NodeState => {
  switch (action.type) {
    case 'SELECT-NODE':
      return handleSelectNode(state, action);
    case 'ADD-NODE':
      return handleAddNode(state);
    case 'MOVE-NODE':
      return handleMoveNode(state, action);
    case 'ADD-CONNECTION':
      return handleAddConnection(state, action);
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;
