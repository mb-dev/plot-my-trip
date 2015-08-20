import React from 'react';
import { DragSource } from 'react-dnd';

import dispatcher from '../../dispatcher/dispatcher.js'
import ActionType from '../../trips/action_types'

const groupSource = {
  beginDrag(props) {
    return {
      id: props.location.id,
      groupId: props.location.groupId
    };
  }
};

const LocationItem = 'location';

@DragSource(LocationItem, groupSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class GroupMember extends React.Component {
  constructor(props) {
    super(props);
    this.onDeleteLocation = this.onDeleteLocation.bind(this);
  }
  onDeleteLocation() {
    dispatcher.dispatch({actionType: ActionType.LOCATIONS.DELETE_LOCATION, locationId: this.props.location.id});
  }
  render() {
    const { isDragging, connectDragSource, text } = this.props;
    return connectDragSource(
      <li style={{ opacity: isDragging ? 0.5 : 1 }}>
        <span>{this.props.location.name}</span>
        <span className="controls">
          <a><i className="fa fa-caret-up"></i></a>
          <a><i className="fa fa-caret-down"></i></a>
          <a><i className="fa fa-times text-danger" onClick={this.onDeleteLocation}></i></a>
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
