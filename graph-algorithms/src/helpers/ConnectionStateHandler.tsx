import { GraphState, GraphAction, ConnectionIndexData } from './ReduxStore';

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

export const handleUpdateConnectionWeight = (
  state: GraphState,
  action: GraphAction
) => {
  if (state.selectedConnectionIndex === -1 || action.newValue === undefined) {
    return state;
  }

  return {
    nodes: state.nodes,
    connectionsData: [
      ...state.connectionsData.slice(0, state.selectedConnectionIndex),
      {
        ...state.connectionsData[state.selectedConnectionIndex],
        weight: action.newValue!,
      },
      ...state.connectionsData.slice(state.selectedConnectionIndex + 1),
    ],
    selectedNodeIndex: state.selectedNodeIndex,
    selectedConnectionIndex: state.selectedConnectionIndex,
  };
};

export const handleAddConnection = (
  state: GraphState,
  action: GraphAction
): GraphState => {
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
        weight: '0',
        selected: false,
      },
    ]),
    selectedNodeIndex: state.selectedNodeIndex,
    selectedConnectionIndex: state.selectedConnectionIndex,
  };
};

export const handleSelectConnection = (
  state: GraphState,
  action: GraphAction
): GraphState => {
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
    selectedConnectionIndex: newlySelected ? action.connectionIndex! : -1,
  };
};

export const handleDeleteConnection = (state: GraphState): GraphState => {
  if (state.selectedConnectionIndex === -1) {
    return state;
  }

  return {
    nodes: state.nodes,
    connectionsData: state.connectionsData.filter(
      (_, index) => index !== state.selectedConnectionIndex
    ),
    selectedNodeIndex: state.selectedNodeIndex,
    selectedConnectionIndex: -1,
  };
};
