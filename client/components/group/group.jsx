import React from 'react';
import classNames from 'classnames'
import { DropTarget } from 'react-dnd';

import dispatcher from '../../dispatcher/dispatcher'
import ActionType from '../../stores/action_types'
import tripsStore from '../../stores/trips_store'
import GroupMember from './group_member'

require('./group.less');

const LocationItem = 'location';

const locationTarget = {
  canDrop(props, monitor) {
    return monitor.getItem().groupId !== props.group.id;
  },
  drop(props, monitor) {
    if (props.group.id) {
      dispatcher.dispatch({
        actionType: ActionType.GROUPS.ADD_PLACE_TO_GROUP,
        groupId: props.group.id,
        locationId: monitor.getItem().id,
      });
    } else {
      dispatcher.dispatch({
        actionType: ActionType.LOCATIONS.UNASSIGN_LOCATION,
        regionId: props.region.id,
        locationId: monitor.getItem().id,
      });
    }
  }
};

@DropTarget(LocationItem, locationTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
export default class Group extends React.Component {
  constructor(props) {
    super(props);
    this.state = {groupMembers: [], selectedGroup: null, groupColor: null};
    this.onTripsStoreChange = this.onTripsStoreChange.bind(this);
  }
  onTripsStoreChange() {
    if (!tripsStore.currentTrip) {
      return;
    }
    let members = []
    if (this.props.group.id) {
      members = tripsStore.currentTrip.getGroupMembers(this.props.group.id);
    } else {
      members = tripsStore.currentTrip.getUnassignedLocations();
    }
    let activeGroup = tripsStore.currentTrip.getActiveGroup();
    let groupColor = tripsStore.currentTrip.getColorOfGroup(this.props.group.id);
    this.setState({
      groupMembers: members,
      activeGroup: activeGroup,
      groupColor: groupColor.color
    });
  }
  componentDidMount() {
    tripsStore.addChangeListener(this.onTripsStoreChange);
    // Not sure why this line is needed
    this.onTripsStoreChange();
  }
  componentWillUnmount() {
    tripsStore.removeChangeListener(this.onTripsStoreChange);
  }
  render() {
    const {canDrop, isOver, connectDropTarget} = this.props;
    const groupClassName = classNames({
      'group': true,
      'drag-item-is-over': canDrop && isOver,
      'active': this.state.activeGroup && this.state.activeGroup.id == this.props.group.id,
      'scrape': !this.props.group.id,
    });

    let groupMembers = this.state.groupMembers.map(function(location, index) {
      var className = '';
      return (<GroupMember key={location.id} location={location} />);
    });

    let noGroupMembersElement = <div className="no-group-members">Day has no locations</div>
    let groupColorStyle = {backgroundColor: this.state.groupColor};

    return connectDropTarget(
      <div className={groupClassName}>
        { this.props.group.id && 
          <div className="group-controls">
            <a>Delete Day</a>
          </div>
        }
        <div>
          <div className="group-color" style={groupColorStyle}/>
          <h4>{this.props.group.name}</h4>
        </div>
        { this.state.groupMembers.length == 0 &&
          <div className="no-group-members text-muted">Day has no locations</div>
        }
        <ol className="group-members">
          {groupMembers}
        </ol>
      </div>
    );
  }
}

Group.propTypes = {
  group: React.PropTypes.object,
  isOver: React.PropTypes.bool.isRequired,
  canDrop: React.PropTypes.bool.isRequired,
  connectDropTarget: React.PropTypes.func.isRequired,
};
