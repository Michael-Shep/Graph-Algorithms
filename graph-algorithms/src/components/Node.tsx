import React from 'react';
import './Node.css';

interface NodeProps {
  xPosition: number;
  yPosition: number;
}

const Node = (props: NodeProps) => {
  const positionStyle = {
    left: props.xPosition,
    top: props.yPosition,
  };

  return <div id="node" style={positionStyle}></div>;
};

export default Node;
