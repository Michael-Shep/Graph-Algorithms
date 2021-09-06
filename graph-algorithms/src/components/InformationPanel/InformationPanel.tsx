import React from 'react';
import './InformationPanel.css';
import { NodeData } from '../Node/Node';
import { connect } from 'react-redux';
import store, { NodeState } from '../../helpers/ReduxStore';

interface InformationPanelProps {
  nodes: NodeData[];
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

  const getBody = () => {
    if (props.selectedNodeIndex === -1) {
      return <div> Select a node to view and modify its information here</div>;
    }

    return (
      <div>
        <p>Value: {props.nodes[props.selectedNodeIndex].value}</p>
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
  selectedNodeIndex: state.selectedNodeIndex,
});

export default connect(mapStateToProps)(InformationPanel);
