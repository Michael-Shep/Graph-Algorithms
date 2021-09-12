import React, { ChangeEvent, MouseEvent } from 'react';
import './InformationPanel.css';
import { NodeData } from '../Node/Node';
import { connect } from 'react-redux';
import store, {
  ConnectionIndexData,
  NodeState,
} from '../../helpers/ReduxStore';

interface InformationPanelProps {
  nodes: NodeData[];
  connectionsData: ConnectionIndexData[];
  selectedNodeIndex: number;
}

const InformationPanel = (props: InformationPanelProps) => {
  const getTitleText = () => {
    if (props.selectedNodeIndex !== -1) {
      return 'Node ' + props.selectedNodeIndex;
    } else {
      return 'Information Panel';
    }
  };

  const handleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value !== undefined) {
      store.dispatch({
        type: 'UPDATE-NODE-VALUE',
        newValue: event.target.value!,
      });
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

  const deleteButtonHandler = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    store.dispatch({ type: 'DELETE-NODE' });
  };

  const getBody = () => {
    if (props.selectedNodeIndex === -1) {
      return <div> Select a node to view and modify its information here</div>;
    }

    return (
      <div>
        <form>
          <label className="formLabel">Value:</label>
          <input
            className="formInput"
            type="text"
            value={props.nodes[props.selectedNodeIndex].value}
            onChange={handleValueChange}
          />
          <p className="formSubheading">Connections:</p>
          {listConnectionsForNode()}
          <button className="formButtonStyle" onClick={deleteButtonHandler}>
            Delete Node
          </button>
        </form>
      </div>
    );
  };

  return (
    <div id="panel">
      <h1 id="heading">{getTitleText()}</h1>
      {getBody()}
    </div>
  );
};

const mapStateToProps = (state: NodeState) => ({
  nodes: state.nodes,
  connectionsData: state.connectionsData,
  selectedNodeIndex: state.selectedNodeIndex,
});

export default connect(mapStateToProps)(InformationPanel);
