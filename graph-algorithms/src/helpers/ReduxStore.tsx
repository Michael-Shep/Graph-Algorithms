import { createStore } from 'redux';
import { NodeData } from '../components/Node/Node';
import Constants from './Constants';

export interface NodeState {
  nodes: NodeData[];
}

export interface NodeAction {
  type: String;
  nodeIndex?: number;
}

const initialState: NodeState = {
  nodes: [
    { xPosition: 100, yPosition: 200, value: 1, active: true },
    { xPosition: 200, yPosition: 300, value: 2, active: false },
  ],
};

const handleFlipActive = (state: NodeState, action: NodeAction): NodeState => {
  if (action.nodeIndex !== undefined) {
    return {
      nodes: [
        ...state.nodes.slice(0, action.nodeIndex),
        {
          ...state.nodes[action.nodeIndex],
          active: !state.nodes[action.nodeIndex].active,
        },
        ...state.nodes.slice(action.nodeIndex + 1),
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
        active: false,
      },
    ]),
  };
};

const reducer = (
  state: NodeState = initialState,
  action: NodeAction
): NodeState => {
  switch (action.type) {
    case 'FLIP-ACTIVE':
      return handleFlipActive(state, action);
    case 'ADD-NODE':
      return handleAddNode(state);
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;
