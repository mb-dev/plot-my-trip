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
    dispatcher.dispatch({
      actionType: ActionType.GROUPS.ADD_PLACE_TO_GROUP,
      groupId: props.group.id,
      locationId: monitor.getItem().id
    });
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
    this.onSelectGroup = this.onSelectGroup.bind(this);
  }
  onTripsStoreChange() {
    if (!tripsStore.currentTrip) {
      return;
    }
    let members = tripsStore.currentTrip.getGroupMembers(this.props.group.id);
    let activeGroup = tripsStore.currentTrip.getActiveGroup();
    let groupColor = tripsStore.currentTrip.getColorOfGroup(this.props.group.id);
    this.setState({groupMembers: members, activeGroup: activeGroup, groupColor: groupColor});
  }
  onSelectGroup() {
    dispatcher.dispatch({actionType: ActionType.GROUPS.SELECT_GROUP, groupId: this.props.group.id});
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
      'active': this.state.activeGroup && this.state.activeGroup.id == this.props.group.id
    });

    let groupMembers = this.state.groupMembers.map(function(location, index) {
      var className = '';
      return (<GroupMember key={location.id} location={location} />);
    });

    let noGroupMembersElement = <div className="no-group-members">Group has no members</div>
    let groupColorStyle = {'background-color': this.state.groupColor};

    return connectDropTarget(
      <div className={groupClassName}>
        <div className="group-controls">
          <a>Delete Group</a>
        </div>
        <div>
          <div className="group-color" style={groupColorStyle}/>
          <h4 onClick={this.onSelectGroup}>{this.props.group.name}</h4>
        </div>
        { this.state.groupMembers.length == 0 && noGroupMembersElement}
        <ul className="group-members">
          {groupMembers}
        </ul>
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
