import { createStore } from 'redux';
import { NodeData } from '../components/Node/Node';
import Constants from './Constants';

export interface ConnectionIndexData {
  startNodeIndex: number;
  endNodeIndex: number;
  weight: number;
  selected: boolean;
}

export interface NodeState {
  nodes: NodeData[];
  connectionsData: ConnectionIndexData[];
  selectedNodeIndex: number;
  selectedConnectionIndex: number;
}

export interface NodeAction {
  type: String;
  nodeIndex?: number;
  connectionIndex?: number;
  xPosition?: number;
  yPosition?: number;
  startNodeIndex?: number;
  endNodeIndex?: number;
  newValue?: string;
}

const initialState: NodeState = {
  nodes: [
    { xPosition: 100, yPosition: 500, value: '1', selected: false },
    { xPosition: 200, yPosition: 600, value: '2', selected: false },
  ],
  connectionsData: [],
  selectedNodeIndex: -1,
  selectedConnectionIndex: -1,
};

const handleSelectNode = (state: NodeState, action: NodeAction): NodeState => {
  if (
    action.nodeIndex === undefined ||
    action.nodeIndex <= -1 ||
    action.nodeIndex >= state.nodes.length
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
  let newConnections;

  if (state.selectedConnectionIndex !== -1) {
    newConnections = [
      ...state.connectionsData.slice(0, state.selectedConnectionIndex),
      {
        ...state.connectionsData[state.selectedConnectionIndex],
        selected: false,
      },
      ...state.connectionsData.slice(state.selectedConnectionIndex + 1),
    ];
  }
  if (newlySelected && state.selectedNodeIndex !== -1) {
    newNodes[state.selectedNodeIndex].selected = false;
  }

  return {
    nodes: newNodes,
    connectionsData:
      newConnections === undefined ? state.connectionsData : newConnections,
    selectedNodeIndex: newlySelected ? action.nodeIndex : -1,
    selectedConnectionIndex: -1,
  };
};

const handleAddNode = (state: NodeState): NodeState => {
  return {
    nodes: state.nodes.concat([
      {
        xPosition: Constants.NEW_NODE_X_POSITION,
        yPosition: Constants.NEW_NODE_Y_POSITION,
        value: '0',
        selected: false,
      },
    ]),
    connectionsData: state.connectionsData,
    selectedNodeIndex: state.selectedNodeIndex,
    selectedConnectionIndex: state.selectedConnectionIndex,
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
    connectionsData: state.connectionsData,
    selectedNodeIndex: state.selectedNodeIndex,
    selectedConnectionIndex: state.selectedConnectionIndex,
  };
};

const handleUpdateNodeValue = (
  state: NodeState,
  action: NodeAction
): NodeState => {
  if (state.selectedNodeIndex === -1 || action.newValue === undefined) {
    return state;
  }

  return {
    nodes: [
      ...state.nodes.slice(0, state.selectedNodeIndex),
      {
        ...state.nodes[state.selectedNodeIndex],
        value: action.newValue!,
      },
      ...state.nodes.slice(state.selectedNodeIndex + 1),
    ],
    connectionsData: state.connectionsData,
    selectedNodeIndex: state.selectedNodeIndex,
    selectedConnectionIndex: state.selectedConnectionIndex,
  };
};

const doesConnectionAlreadyExist = (
  connectionsData: ConnectionIndexData[],
  newStartNodeIndex: number,
  newEndNodeIndex: number
): boolean => {
  let connectionExists = false;
  connectionsData.forEach((connection) => {
    if (
      (connection.startNodeIndex === newStartNodeIndex &&
        connection.endNodeIndex === newEndNodeIndex) ||
      (connection.startNodeIndex === newEndNodeIndex &&
        connection.endNodeIndex === newStartNodeIndex)
    ) {
      connectionExists = true;
      return;
    }
  });

  return connectionExists;
};

const handleAddConnection = (
  state: NodeState,
  action: NodeAction
): NodeState => {
  if (
    action.startNodeIndex === undefined ||
    action.endNodeIndex === undefined ||
    doesConnectionAlreadyExist(
      state.connectionsData,
      action.startNodeIndex!,
      action.endNodeIndex!
    )
  ) {
    return state;
  }
  return {
    nodes: state.nodes,
    connectionsData: state.connectionsData.concat([
      {
        startNodeIndex: action.startNodeIndex!,
        endNodeIndex: action.endNodeIndex!,
        weight: 0,
        selected: false,
      },
    ]),
    selectedNodeIndex: state.selectedNodeIndex,
    selectedConnectionIndex: state.selectedConnectionIndex,
  };
};

const handleSelectConnection = (
  state: NodeState,
  action: NodeAction
): NodeState => {
  if (action.connectionIndex === undefined) {
    return state;
  }

  const newlySelected =
    !state.connectionsData[action.connectionIndex!].selected;

  const newConnectionData = [
    ...state.connectionsData.slice(0, action.connectionIndex!),
    {
      ...state.connectionsData[action.connectionIndex!],
      selected: !state.connectionsData[action.connectionIndex!].selected,
    },
    ...state.connectionsData.slice(action.connectionIndex! + 1),
  ];

  let newNodes;

  //Clear Previously Selected Node
  if (state.selectedNodeIndex !== -1) {
    newNodes = [
      ...state.nodes.slice(0, state.selectedNodeIndex),
      {
        ...state.nodes[state.selectedNodeIndex],
        selected: false,
      },
      ...state.nodes.slice(state.selectedNodeIndex + 1),
    ];
  }
  if (newlySelected && state.selectedConnectionIndex !== -1) {
    newConnectionData[state.selectedConnectionIndex].selected = false;
  }

  return {
    nodes: newNodes === undefined ? state.nodes : newNodes,
    connectionsData: newConnectionData,
    selectedNodeIndex: -1,
    selectedConnectionIndex: state.selectedConnectionIndex,
  };
};

const getConnectionsWithoutSelectedNode = (
  state: NodeState
): ConnectionIndexData[] => {
  return state.connectionsData.filter(
    (connection) =>
      connection.startNodeIndex !== state.selectedNodeIndex &&
      connection.endNodeIndex !== state.selectedNodeIndex
  );
};

const handleDeleteNode = (state: NodeState): NodeState => {
  if (state.selectedNodeIndex === -1) {
    return state;
  }

  return {
    nodes: [
      ...state.nodes.slice(0, state.selectedNodeIndex),
      ...state.nodes.slice(state.selectedNodeIndex + 1),
    ],
    connectionsData: getConnectionsWithoutSelectedNode(state),
    selectedNodeIndex: -1,
    selectedConnectionIndex: state.selectedConnectionIndex,
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
    case 'UPDATE-NODE-VALUE':
      return handleUpdateNodeValue(state, action);
    case 'DELETE-NODE':
      return handleDeleteNode(state);
    case 'ADD-CONNECTION':
      return handleAddConnection(state, action);
    case 'SELECT-CONNECTION':
      return handleSelectConnection(state, action);
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;
