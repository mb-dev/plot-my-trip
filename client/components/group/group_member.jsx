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
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const dragGroup = monitor.getItem().groupId;
    const hoverIndex = props.index;

    if (dragGroup !== props.location.groupId) {
      if (props.location.groupId && props.location.groupId !== 'none') {
        actions.addPlaceToGroup(props.location.groupId, monitor.getItem().id, hoverIndex);
      } else {
        actions.unassignLocation(props.group.regionId, monitor.getItem().id);
      }
    } else {
      actions.moveLocationTo(props.location.id, dragIndex, hoverIndex);
    }
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
    group: React.PropTypes.object,
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
    const {isDragging, connectDragSource, connectDropTarget} = this.props;
    const googleData = this.props.location.googleData;
    const component = (
      <li className="group-member" style={{opacity: isDragging ? 0.5 : 1}} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        <div>
          <span>{this.props.location.name}</span>
          {this.props.editable &&
            <span className="controls">
              <a target="_blank" href={`https://www.google.com/maps/place/${googleData.name}, ${googleData.city}/${googleData.position.lat},${googleData.position.lng}`}>
                <i className="fa fa-crosshairs" />
              </a>
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
