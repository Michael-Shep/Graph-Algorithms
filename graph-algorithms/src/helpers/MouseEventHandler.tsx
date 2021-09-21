import Constants from '../helpers/Constants';
import { NodeData } from '../components/Node/Node';
import { Size } from '../helpers/useWindowSize';
import { MouseEvent } from 'react';
import store, { ConnectionIndexData } from '../helpers/ReduxStore';
import { checkIfPointOnConnectionLine } from '../components/Connection/Connection';
import { InteractionMode } from '../components/App/App';
import { currentAlgorithm } from '../helpers/Algorithm';

/**
 * Gets whether the mouse press occurred in the area where the graphs can be drawn
 * @param clickX The x position of the mouse press
 * @param clickY The y position of the mouse press
 * @param graphDisplay The HTMLDiv element for the graphArea
 * @returns boolean for whether the press is in the graph area bounds or not
 */
const isMouseInGraphAreaBounds = (
  clickX: number,
  clickY: number,
  graphDisplay: HTMLDivElement
): boolean => {
  const boundingRect = graphDisplay.getBoundingClientRect();
  return (
    clickX >= boundingRect.x + Constants.NODE_SIZE / 2 &&
    clickX <= boundingRect.x + boundingRect.width - Constants.NODE_SIZE / 2 &&
    clickY >= boundingRect.y + Constants.NODE_SIZE / 2 &&
    clickY <= boundingRect.y + boundingRect.height - Constants.NODE_SIZE / 2
  );
};

/**
 * Handles whenever the mouse is moved on the screen
 * @param mouseEvent The mouse move event containing all information about the action performed
 * @param selectionPopupVisible Whether the algorithm selection popup is currently visible
 * @param isMouseOnNode Whether we are currently moving a node about with the mouse
 * @param graphDisplay The HTMLDiv element for where the graphs can be drawn
 */
export const handleMouseMove = (
  mouseEvent: MouseEvent,
  selectionPopupVisible: boolean,
  isMouseOnNode: boolean,
  graphDisplay: HTMLDivElement
) => {
  if (
    !selectionPopupVisible &&
    isMouseOnNode &&
    isMouseInGraphAreaBounds(mouseEvent.pageX, mouseEvent.pageY, graphDisplay)
  ) {
    store.dispatch({
      type: 'MOVE-NODE',
      xPosition: mouseEvent.pageX,
      yPosition: mouseEvent.pageY,
    });
  }
};

/**
 * Checks whether a mouse event was within the bounds of a specific node
 * @param node The node to be checked
 * @param clickX The x position of the mouse event
 * @param clickY The y position of the mouse event
 * @returns True if the event was within the node, false otherwise
 */
const isMouseInNodeBounds = (
  node: NodeData,
  clickX: number,
  clickY: number
): boolean => {
  return (
    node.xPosition <= clickX &&
    node.xPosition + Constants.NODE_SIZE >= clickX &&
    node.yPosition <= clickY &&
    node.yPosition + Constants.NODE_SIZE >= clickY
  );
};

/**
 * Checks whether the mouse event was outside the bounds of the alogrithm selection popup window
 * @param clickX The x position of the mouse event
 * @param clickY The y position of the mouse event
 * @param size The size of the current window
 * @returns True if the mouse event was outside of the popup bounds, false otherwise
 */
const isMouseOutsidePopupWindow = (
  clickX: number,
  clickY: number,
  size: Size
): boolean => {
  if (!size) {
    return true;
  }

  if (
    clickX < size.width! / 2 - Constants.ALGORITHM_POPUP_WIDTH / 2 ||
    clickX > size.width! / 2 + Constants.ALGORITHM_POPUP_WIDTH / 2 ||
    clickY < size.height! / 2 - Constants.ALGORITHM_POPUP_HEIGHT / 2 ||
    clickY > size.height! / 2 + Constants.ALGORITHM_POPUP_HEIGHT / 2
  ) {
    return true;
  }

  return false;
};

/**
 * Handles the mouse events for when we are in the selection mode of the graph system
 * @param clickEvent The mouse event
 * @param nodes Array containing all our node data
 * @param connectionsData Array containing all our connection data
 * @param setIsMouseOnNode Setter function for whether a node is currently selected
 */
const handleObjectSelection = (
  clickEvent: MouseEvent,
  nodes: NodeData[],
  connectionsData: ConnectionIndexData[],
  setIsMouseOnNode: (value: boolean) => void
) => {
  let selectionMade = false;
  nodes.forEach((node, index) => {
    if (isMouseInNodeBounds(node, clickEvent.pageX, clickEvent.pageY)) {
      setIsMouseOnNode(true);
      store.dispatch({
        type: 'SELECT-NODE',
        nodeIndex: index,
      });
      selectionMade = true;
      return;
    }
  });
  if (!selectionMade) {
    connectionsData.forEach((connectionIndexData, index) => {
      if (
        checkIfPointOnConnectionLine(
          {
            startNode: nodes[connectionIndexData.startNodeIndex],
            endNode: nodes[connectionIndexData.endNodeIndex],
            weight: connectionIndexData.weight,
            selected: connectionIndexData.selected,
          },
          clickEvent.pageX,
          clickEvent.pageY
        )
      ) {
        store.dispatch({
          type: 'SELECT-CONNECTION',
          connectionIndex: index,
        });
        return;
      }
    });
  }
};

/**
 * Handles the mouse events for when we are in the adding connection part of the graph system
 * @param nodes Array containing all our node data
 * @param clickEvent The mouseevent that occurred
 * @param firstSelectedNodeIndex The index of the first node selected as part of the connection (possibly -1)
 * @param setInformationText Setter function for the text displayed at the top of the screen for information
 * @param setFirstSelectedNodeIndex Setter function for the first node of the connection
 * @param setInteractionMode Setter function for the current mode of interaction (selection or connection)
 */
const handleAddConnection = (
  nodes: NodeData[],
  clickEvent: MouseEvent,
  firstSelectedNodeIndex: number,
  setInformationText: (value: string) => void,
  setFirstSelectedNodeIndex: (value: number) => void,
  setInteractionMode: (value: InteractionMode) => void
) => {
  nodes.forEach((node, index) => {
    if (isMouseInNodeBounds(node, clickEvent.pageX, clickEvent.pageY)) {
      if (firstSelectedNodeIndex === -1) {
        setInformationText(Constants.CONNECTION_END_NODE_TEXT);
        setFirstSelectedNodeIndex(index);
      } else if (index !== firstSelectedNodeIndex) {
        store.dispatch({
          type: 'ADD-CONNECTION',
          startNodeIndex: firstSelectedNodeIndex,
          endNodeIndex: index,
        });
        setFirstSelectedNodeIndex(-1);
        setInteractionMode(InteractionMode.SELECTION);
      }
    }
  });
};

const algorithmNodeSelection = (
  nodes: NodeData[],
  clickEvent: MouseEvent,
  setInteractionMode: (value: InteractionMode) => void,
  setAlgorithmStartNodeIndex: (value: number) => void,
  startNode: boolean
) => {
  nodes.forEach((node, index) => {
    if (
      isMouseInNodeBounds(node, clickEvent.pageX, clickEvent.pageY) &&
      !node.algorithmStartOrEndNode
    ) {
      store.dispatch({ type: 'SELECT-ALGORITHM-NODE', nodeIndex: index });
      if (startNode) {
        setInteractionMode(InteractionMode.END_NODE_SELECTION);
        setAlgorithmStartNodeIndex(index);
      } else {
        setInteractionMode(InteractionMode.ALGORITHM);
        currentAlgorithm.performStep();
      }
      return;
    }
  });
};

/**
 * Handles whenever the a mouse button is clicked
 * @param clickEvent The mouse event that occurred
 * @param nodes Array containing all the nodes in our graph
 * @param connectionsData Array containing all the connections in our graph
 * @param selectionPopupVisible Whether the algorithm selection popup is currently visible
 * @param interactionMode The current interaction mode of the system (selection or connection)
 * @param graphDisplay The HTMLDiv element for the area where we can draw graphs
 * @param firstSelectedNodeIndex The index of the first node in a new connection (possibly -1)
 * @param size The current size of the window
 * @param setIsMouseOnNode Setter for whether we have currently pressed on a node
 * @param setInformationText Setter for the information text which displays at the top of the page
 * @param setFirstSelectedNodeIndex Setter for the first node as part of a new connection
 * @param setInteractionMode Setter for the interaction mode of the system
 * @param setSelectionPopupVisible Setter for whether the alogrithm selection popup is currently visible
 * @param setAlgorithmStartNodeIndex Setter for the start node of the selected algorithm
 */
export const mouseDownHandler = (
  clickEvent: MouseEvent,
  nodes: NodeData[],
  connectionsData: ConnectionIndexData[],
  selectionPopupVisible: boolean,
  interactionMode: InteractionMode,
  graphDisplay: HTMLDivElement,
  firstSelectedNodeIndex: number,
  size: Size,
  setIsMouseOnNode: (value: boolean) => void,
  setInformationText: (value: string) => void,
  setFirstSelectedNodeIndex: (value: number) => void,
  setInteractionMode: (value: InteractionMode) => void,
  setSelectionPopupVisible: (value: boolean) => void,
  setAlgorithmStartNodeIndex: (value: number) => void
) => {
  if (
    !selectionPopupVisible &&
    isMouseInGraphAreaBounds(clickEvent.pageX, clickEvent.pageY, graphDisplay)
  ) {
    if (interactionMode === InteractionMode.SELECTION) {
      handleObjectSelection(
        clickEvent,
        nodes,
        connectionsData,
        setIsMouseOnNode
      );
    } else if (interactionMode === InteractionMode.NEW_CONNECTION) {
      handleAddConnection(
        nodes,
        clickEvent,
        firstSelectedNodeIndex,
        setInformationText,
        setFirstSelectedNodeIndex,
        setInteractionMode
      );
    } else if (interactionMode === InteractionMode.START_NODE_SELECTION) {
      algorithmNodeSelection(
        nodes,
        clickEvent,
        setInteractionMode,
        setAlgorithmStartNodeIndex,
        true
      );
    } else if (interactionMode === InteractionMode.END_NODE_SELECTION) {
      algorithmNodeSelection(
        nodes,
        clickEvent,
        setInteractionMode,
        setAlgorithmStartNodeIndex,
        false
      );
    }
  } else {
    if (isMouseOutsidePopupWindow(clickEvent.pageX, clickEvent.pageY, size)) {
      setSelectionPopupVisible(false);
    }
  }
};
