import React from 'react';
import {DragSource} from 'react-dnd';
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
  render() {
    const {isDragging, connectDragSource} = this.props;
    const component = (
      <li style={{opacity: isDragging ? 0.5 : 1}} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
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
