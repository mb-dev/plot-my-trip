import React from 'react';
import {DragSource} from 'react-dnd';

import dispatcher from '../../dispatcher/dispatcher';
import ActionType from '../../stores/action_types';
import actions from '../../actions/actions';

const groupSource = {
  beginDrag(props) {
    return {
      id: props.location.id,
      groupId: props.location.groupId,
    };
  },
};

const LocationItem = 'location';

@DragSource(LocationItem, groupSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
export default class GroupMember extends React.Component {
  static propTypes = {
    location: React.PropTypes.object,
    // Injected by React DnD:
    isDragging: React.PropTypes.bool.isRequired,
    connectDragSource: React.PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.onDeleteLocation = this.onDeleteLocation.bind(this);
    this.onEditLocation = this.onEditLocation.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.moveLocationUp = this.moveLocationUp.bind(this);
    this.moveLocationDown = this.moveLocationDown.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.state = {editing: false};
  }
  onDeleteLocation() {
    actions.deleteLocation(this.props.location);
  }
  onEditLocation() {
    this.setState({editing: true});
  }
  closeModal() {
    this.setState({editing: false});
  }
  onSubmit(e) {
    e.preventDefault();
    return false;
  }
  moveLocationUp() {
    actions.moveLocationUp(this.props.location.id);
  }
  moveLocationDown() {
    actions.moveLocationDown(this.props.location.id);
  }
  onMouseEnter() {
    actions.setFocusLocation(this.props.location.id);
  }
  onMouseLeave() {
    actions.setFocusLocation(null);
  }
  render() {
    const { isDragging, connectDragSource, text } = this.props;
    const component = (
      <li style={{ opacity: isDragging ? 0.5 : 1 }} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        <div>
          <span>{this.props.location.name}</span>
          <span className="controls">
            <a onClick={this.onEditLocation}><i className="fa fa-pencil"></i></a>
            <a onClick={this.moveLocationUp}><i className="fa fa-caret-up"></i></a>
            <a onClick={this.moveLocationDown}><i className="fa fa-caret-down"></i></a>
            <a onClick={this.onDeleteLocation}><i className="fa fa-times text-danger"></i></a>
          </span>
        </div>
        { this.props.location.comments &&
          <div className="text-muted">
            {this.props.location.comments}
          </div>
        }
      </li>
    );
    return connectDragSource(component);
  }
}

export default GroupMember;
