import { GraphState, GraphAction, ConnectionIndexData } from './ReduxStore';
import Constants from './Constants';
import { NodeData } from '../components/Node/Node';

export const handleSelectNode = (
  state: GraphState,
  action: GraphAction
): GraphState => {
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

export const handleSelectNodeForAlgorithm = (
  state: GraphState,
  action: GraphAction
): GraphState => {
  if (
    action.nodeIndex === undefined ||
    action.nodeIndex <= -1 ||
    action.nodeIndex >= state.nodes.length
  ) {
    return state;
  }

  return {
    nodes: [
      ...state.nodes.slice(0, action.nodeIndex!),
      {
        ...state.nodes[action.nodeIndex!],
        algorithmStartOrEndNode: true,
      },
      ...state.nodes.slice(action.nodeIndex! + 1),
    ],
    connectionsData: state.connectionsData,
    selectedConnectionIndex: state.selectedConnectionIndex,
    selectedNodeIndex: state.selectedNodeIndex,
  };
};

export const handleAddNode = (state: GraphState): GraphState => {
  return {
    nodes: state.nodes.concat([
      {
        xPosition: Constants.NEW_NODE_X_POSITION,
        yPosition: Constants.NEW_NODE_Y_POSITION,
        value: '0',
        selected: false,
        algorithmStartOrEndNode: false,
        distanceFromStartNode: -1,
        visited: false,
      },
    ]),
    connectionsData: state.connectionsData,
    selectedNodeIndex: state.selectedNodeIndex,
    selectedConnectionIndex: state.selectedConnectionIndex,
  };
};

export const handleMoveNode = (
  state: GraphState,
  action: GraphAction
): GraphState => {
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

export const handleUpdateNodeValue = (
  state: GraphState,
  action: GraphAction
): GraphState => {
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

export const handleUpdateNodeDistance = (
  state: GraphState,
  action: GraphAction
): GraphState => {
  if (
    action.nodeIndex === undefined ||
    action.newValue === undefined ||
    isNaN(+action.newValue)
  ) {
    return state;
  }

  const newNodes = [
    ...state.nodes.slice(0, action.nodeIndex!),
    {
      ...state.nodes[action.nodeIndex!],
      distanceFromStartNode: Number(action.newValue!),
      selected: true,
    },
    ...state.nodes.slice(action.nodeIndex! + 1),
  ];
  if (state.selectedNodeIndex !== -1) {
    newNodes[state.selectedNodeIndex].selected = false;
    newNodes[state.selectedNodeIndex].visited = true;
  }

  return {
    nodes: newNodes,
    connectionsData: state.connectionsData,
    selectedNodeIndex: action.nodeIndex!,
    selectedConnectionIndex: state.selectedConnectionIndex,
  };
};

const getConnectionsWithoutSelectedNode = (
  state: GraphState
): ConnectionIndexData[] => {
  return state.connectionsData.filter(
    (connection) =>
      connection.startNodeIndex !== state.selectedNodeIndex &&
      connection.endNodeIndex !== state.selectedNodeIndex
  );
};

export const handleDeleteNode = (state: GraphState): GraphState => {
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

export const clearAllSelections = (state: GraphState): GraphState => {
  const newNodes: NodeData[] = [...state.nodes];
  if (state.selectedNodeIndex !== -1) {
    newNodes[state.selectedNodeIndex].selected = false;
  }

  for (let i = 0; i < newNodes.length; i++) {
    newNodes[i].algorithmStartOrEndNode = false;
    newNodes[i].distanceFromStartNode = -1;
  }

  let newConnections: ConnectionIndexData[] = [];
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

  return {
    nodes: newNodes,
    connectionsData:
      newConnections.length !== 0 ? newConnections : state.connectionsData,
    selectedNodeIndex: -1,
    selectedConnectionIndex: -1,
  };
};
