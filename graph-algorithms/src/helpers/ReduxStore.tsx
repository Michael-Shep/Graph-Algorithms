import { createStore } from 'redux';
import { NodeData } from '../components/Node/Node';
import Constants from './Constants';

export interface NodeState {
  nodes: NodeData[];
}

export interface NodeAction {
  type: String;
  nodeIndex?: number;
  xPosition?: number;
  yPosition?: number;
}

let currentSelectedNodeIndex: number = -1;

const initialState: NodeState = {
  nodes: [
    { xPosition: 100, yPosition: 200, value: 1, selected: false },
    { xPosition: 200, yPosition: 300, value: 2, selected: false },
  ],
};

const handleSelectNode = (state: NodeState, action: NodeAction): NodeState => {
  if (action.xPosition === undefined || action.yPosition === undefined) {
    return state;
  }

  let selectedIndex = -1;
  state.nodes.forEach((node, index) => {
    if (
      node.xPosition <= action.xPosition! &&
      node.xPosition + Constants.NODE_SIZE >= action.xPosition! &&
      node.yPosition <= action.yPosition! &&
      node.yPosition + Constants.NODE_SIZE >= action.yPosition!
    ) {
      selectedIndex = index;
      if (currentSelectedNodeIndex === -1) {
        currentSelectedNodeIndex = index;
      } else {
        currentSelectedNodeIndex = -1;
      }
    }
  });

  if (selectedIndex !== -1) {
    return {
      nodes: [
        ...state.nodes.slice(0, selectedIndex),
        {
          ...state.nodes[selectedIndex],
          selected: !state.nodes[selectedIndex].selected,
        },
        ...state.nodes.slice(selectedIndex + 1),
      ],
    };
  }

  return state;
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
  };
};

const handleMoveNode = (state: NodeState, action: NodeAction): NodeState => {
  if (
    currentSelectedNodeIndex === -1 ||
    action.xPosition === undefined ||
    action.yPosition === undefined
  ) {
    return state;
  }

  return {
    nodes: [
      ...state.nodes.slice(0, currentSelectedNodeIndex),
      {
        ...state.nodes[currentSelectedNodeIndex],
        xPosition: action.xPosition - Constants.NODE_SIZE / 2,
        yPosition: action.yPosition - Constants.NODE_SIZE / 2,
      },
      ...state.nodes.slice(currentSelectedNodeIndex + 1),
    ],
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
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;
