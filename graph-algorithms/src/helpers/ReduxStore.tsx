import { createStore } from 'redux';
import { NodeData } from '../components/Node/Node';

export interface NodeState {
  nodes: NodeData[];
}

export interface NodeAction {
  type: String;
  nodeIndex: number;
}

const initialState: NodeState = {
  nodes: [
    { xPosition: 100, yPosition: 100, value: 1, active: true },
    { xPosition: 200, yPosition: 200, value: 2, active: false },
  ],
};

const reducer = (
  state: NodeState = initialState,
  action: NodeAction
): NodeState => {
  switch (action.type) {
    case 'FLIP-ACTIVE':
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
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;
