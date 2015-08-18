import React from 'react';
import { DragSource } from 'react-dnd';

const groupSource = {
  beginDrag(props) {
    return {
      id: props.location.id
    };
  }
};

const LocationItem = 'location';

@DragSource(LocationItem, groupSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class GroupMember extends React.Component {
  render() {
    const { isDragging, connectDragSource, text } = this.props;
    return connectDragSource(
      <li style={{ opacity: isDragging ? 0.5 : 1 }}>
        <span>{this.props.location.name}</span>
        <span className="controls">
          <a><i className="fa fa-caret-up"></i></a>
          <a><i className="fa fa-caret-down"></i></a>
          <a><i className="fa fa-times text-danger"></i></a>
        </span>
      </li>
    );
  }
}

GroupMember.propTypes = {
  location: React.PropTypes.object,
  // Injected by React DnD:
  isDragging: React.PropTypes.bool.isRequired,
  connectDragSource: React.PropTypes.func.isRequired
};
