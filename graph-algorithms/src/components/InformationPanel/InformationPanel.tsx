import React, { ChangeEvent, MouseEvent } from 'react';
import './InformationPanel.css';
import { NodeData } from '../Node/Node';
import { connect } from 'react-redux';
import store, {
  ConnectionIndexData,
  GraphState,
} from '../../helpers/ReduxStore';
import { currentAlgorithm, AlgorithmType } from '../../helpers/Algorithm';

interface InformationPanelProps {
  nodes: NodeData[];
  connectionsData: ConnectionIndexData[];
  selectedNodeIndex: number;
  selectedConnectionIndex: number;
}

const InformationPanel = (props: InformationPanelProps) => {
  const getTitleText = () => {
    if (props.selectedNodeIndex !== -1) {
      return 'Node ' + props.selectedNodeIndex;
    } else if (props.selectedConnectionIndex !== -1) {
      return 'Connection ' + props.selectedConnectionIndex;
    } else {
      return 'Information Panel';
    }
  };

  const handleValueChange = (
    event: ChangeEvent<HTMLInputElement>,
    isNodeEvent: boolean
  ) => {
    if (event.target.value !== undefined) {
      if (isNodeEvent) {
        store.dispatch({
          type: 'UPDATE-NODE-VALUE',
          newValue: event.target.value!,
        });
      } else {
        store.dispatch({
          type: 'UPDATE-CONNECTION-WEIGHT',
          newValue: event.target.value!,
        });
      }
    }
  };

  const doesConnectionInvolveSelectedNode = (
    connectionIndexData: ConnectionIndexData
  ): boolean => {
    return (
      connectionIndexData.startNodeIndex === props.selectedNodeIndex ||
      connectionIndexData.endNodeIndex === props.selectedNodeIndex
    );
  };

  const listConnectionsForNode = () => {
    const nodeConnections = props.connectionsData.filter(
      doesConnectionInvolveSelectedNode
    );

    if (nodeConnections.length === 0) {
      return <p> This node currently has no connections </p>;
    }

    return nodeConnections.map((connection, index) => {
      const otherNodeIndex =
        connection.startNodeIndex === props.selectedNodeIndex
          ? connection.startNodeIndex
          : connection.endNodeIndex;
      return (
        <p key={index} className="leftAligned">
          {index + 1}: Node with value {props.nodes[otherNodeIndex].value},
          Connection Weight: {connection.weight}
        </p>
      );
    });
  };

  const deleteButtonHandler = (
    event: MouseEvent<HTMLButtonElement>,
    isNodeEvent: boolean
  ) => {
    event.preventDefault();
    if (isNodeEvent) {
      store.dispatch({ type: 'DELETE-NODE' });
    } else {
      store.dispatch({ type: 'DELETE-CONNECTION' });
    }
  };

  const getNodeInformationBody = () => {
    return (
      <form>
        <label className="formLabel">Value:</label>
        <input
          className="formInput"
          type="text"
          value={props.nodes[props.selectedNodeIndex].value}
          onChange={(event) => handleValueChange(event, true)}
          onKeyDown={(event) => event.key === 'Enter' && event.preventDefault()}
        />
        <p className="formSubheading">Connections:</p>
        {listConnectionsForNode()}
        <button
          className="formButtonStyle"
          onClick={(event) => deleteButtonHandler(event, true)}
        >
          Delete Node
        </button>
      </form>
    );
  };

  const getConnectionInformationBody = () => {
    return (
      <form>
        <label className="formLabel">Weight:</label>
        <input
          className="formInput"
          type="text"
          value={props.connectionsData[props.selectedConnectionIndex].weight}
          onChange={(event) => handleValueChange(event, false)}
          onKeyDown={(event) => event.key === 'Enter' && event.preventDefault()}
        />
        <p className="formSubheading">Nodes:</p>
        <p className="leftAligned">
          Start Node: Node With Value{' '}
          {
            props.nodes[
              props.connectionsData[props.selectedConnectionIndex]
                .startNodeIndex
            ].value
          }
        </p>
        <p className="leftAligned">
          End Node: Node With Value{' '}
          {
            props.nodes[
              props.connectionsData[props.selectedConnectionIndex].endNodeIndex
            ].value
          }
        </p>
        <button
          className="formButtonStyle"
          onClick={(event) => deleteButtonHandler(event, false)}
        >
          Delete Connection
        </button>
      </form>
    );
  };

  const getSelectionBody = () => {
    if (
      props.selectedNodeIndex === -1 &&
      props.selectedConnectionIndex === -1
    ) {
      return <div> Select a node to view and modify its information here</div>;
    }

    return (
      <div>
        {props.selectedNodeIndex !== -1 && getNodeInformationBody()}
        {props.selectedConnectionIndex !== -1 && getConnectionInformationBody()}
      </div>
    );
  };

  const getAlgorithmBody = () => {
    return (
      <table className="tableStyle">
        <thead>
          <tr>
            <th>Node</th>
            <th>Distance From Start</th>
          </tr>
        </thead>
        <tbody>
          {props.nodes.map((node, index) => {
            return (
              <tr key={index + 'Row'}>
                <td key={index + 'Data0'}>
                  {index}: {node.value}
                </td>
                <td key={index + 'Data1'}>
                  {node.distanceFromStartNode !== -1
                    ? node.distanceFromStartNode
                    : String.fromCodePoint(parseInt('0221E', 16))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div id="panel">
      <h1 id="heading">{getTitleText()}</h1>
      {currentAlgorithm.getAlgorithmType() === AlgorithmType.NONE &&
        getSelectionBody()}
      {currentAlgorithm.getAlgorithmType() !== AlgorithmType.NONE &&
        getAlgorithmBody()}
    </div>
  );
};

const mapStateToProps = (state: GraphState) => ({
  nodes: state.nodes,
  connectionsData: state.connectionsData,
  selectedNodeIndex: state.selectedNodeIndex,
  selectedConnectionIndex: state.selectedConnectionIndex,
});

export default connect(mapStateToProps)(InformationPanel);
