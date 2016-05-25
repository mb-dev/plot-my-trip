import React from 'react';
import ReactDOM from 'react-dom';
import {DragSource, DropTarget} from 'react-dnd';
import actions from '../../actions/actions';

require('./group_member.less');

const groupSource = {
  beginDrag(props) {
    return {
      id: props.location.id,
      groupId: props.location.groupId,
      index: props.index,
    };
  },
};

const groupTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = ReactDOM.findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    component.moveLocationTo(dragIndex, hoverIndex);
    console.log('moving', dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

const LocationItem = 'location';

@DragSource(LocationItem, groupSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
@DropTarget(LocationItem, groupTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))
export default class GroupMember extends React.Component {
  static propTypes = {
    location: React.PropTypes.object,
    // Injected by React DnD:
    isDragging: React.PropTypes.bool.isRequired,
    connectDragSource: React.PropTypes.func.isRequired,
    connectDropTarget: React.PropTypes.func.isRequired,
    editable: React.PropTypes.bool,
    index: React.PropTypes.number.isRequired,
  }
  constructor(props) {
    super(props);
    this.onDeleteLocation = this.onDeleteLocation.bind(this);
    this.onEditLocation = this.onEditLocation.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.moveLocationUp = this.moveLocationUp.bind(this);
    this.moveLocationDown = this.moveLocationDown.bind(this);
  }
  onEditLocation() {
    actions.editLocation(this.props.location.id);
  }
  onDeleteLocation() {
    actions.deleteLocation(this.props.location);
  }
  onMouseEnter() {
    actions.setFocusLocation(this.props.location.id);
  }
  onMouseLeave() {
    actions.setFocusLocation(null);
  }
  moveLocationUp() {
    actions.moveLocationUp(this.props.location.id);
  }
  moveLocationDown() {
    actions.moveLocationDown(this.props.location.id);
  }
  moveLocationTo(index, toIndex) {
    actions.moveLocationTo(this.props.location.id, index, toIndex);
  }
  render() {
    const {isDragging, connectDragSource, connectDropTarget} = this.props;
    const component = (
      <li className="group-member" style={{opacity: isDragging ? 0.5 : 1}} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        <div>
          <span>{this.props.location.name}</span>
          {this.props.editable &&
            <span className="controls">
              <a onClick={this.onEditLocation}><i className="fa fa-pencil"></i></a>
              <a onClick={this.moveLocationUp}><i className="fa fa-caret-up"></i></a>
              <a onClick={this.moveLocationDown}><i className="fa fa-caret-down"></i></a>
              <a onClick={this.onDeleteLocation}><i className="fa fa-times text-danger"></i></a>
            </span>
          }
        </div>
        {this.props.location.comments &&
          <div className="text-muted">
            {this.props.location.comments}
          </div>
        }
      </li>
    );
    return connectDragSource(connectDropTarget(component));
  }
}
