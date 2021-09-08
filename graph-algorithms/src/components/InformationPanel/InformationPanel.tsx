import React, { ChangeEvent } from 'react';
import './InformationPanel.css';
import { NodeData } from '../Node/Node';
import { connect } from 'react-redux';
import store, { NodeState } from '../../helpers/ReduxStore';

interface InformationPanelProps {
  nodes: NodeData[];
  connectionIndexes: number[][];
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
    nodeIndexes: number[]
  ): boolean => {
    return nodeIndexes.includes(props.selectedNodeIndex);
  };

  const listConnectionsForNode = () => {
    const nodeConnections = props.connectionIndexes.filter(
      doesConnectionInvolveSelectedNode
    );

    if (nodeConnections.length === 0) {
      return <p> This node currently has no connections </p>;
    }

    return nodeConnections.map((connection, index) => {
      const otherNodeIndex =
        connection[0] === props.selectedNodeIndex
          ? connection[1]
          : connection[0];
      return (
        <p key={index} className="leftAligned">
          {index + 1}: Node with value {props.nodes[otherNodeIndex].value}
        </p>
      );
    });
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
        </form>
      </div>
    );
  };

  return (
    <div id="panel">
      <h1>{getTitleText()}</h1>
      {getBody()}
    </div>
  );
};

const mapStateToProps = (state: NodeState) => ({
  nodes: state.nodes,
  connectionIndexes: state.connectionIndexes,
  selectedNodeIndex: state.selectedNodeIndex,
});

export default connect(mapStateToProps)(InformationPanel);
